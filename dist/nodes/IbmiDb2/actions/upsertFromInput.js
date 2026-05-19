"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertFromInput = upsertFromInput;
const n8n_workflow_1 = require("n8n-workflow");
const database_1 = require("../methods/database");
const sql_1 = require("../methods/sql");
const IDENTIFIER_SEGMENT_PATTERN = '(?:[A-Za-z_@$#][A-Za-z0-9_@$#]*|"(?:""|[^"])+")';
const IDENTIFIER_PATTERN = new RegExp(`^${IDENTIFIER_SEGMENT_PATTERN}$`);
const QUALIFIED_IDENTIFIER_PATTERN = new RegExp(`^${IDENTIFIER_SEGMENT_PATTERN}(?:\\.${IDENTIFIER_SEGMENT_PATTERN})*$`);
async function upsertFromInput(context, itemIndex) {
    const tableName = (0, sql_1.getRequiredString)(context, 'tableName', itemIndex, 'Table Name');
    const tableIdentifier = getQualifiedIdentifier(context, tableName, itemIndex, 'Table Name');
    const matchColumns = getColumnList(context, 'matchColumns', itemIndex, 'Match Columns');
    const excludeColumns = getOptionalColumnSet(context, 'excludeColumns', itemIndex, 'Columns to Exclude');
    const returnPreviousRows = context.getNodeParameter('returnPreviousRows', itemIndex, false);
    const allowMultipleMatches = context.getNodeParameter('allowMultipleMatches', itemIndex, false);
    const row = getInputRow(context, itemIndex, excludeColumns);
    const whereClause = getWhereClause(context, row, matchColumns, itemIndex);
    return await (0, database_1.withWriteDatabase)(context, itemIndex, async (db) => {
        const previousRows = await getPreviousRows(db, tableIdentifier, whereClause);
        if (previousRows.length > 1 && !allowMultipleMatches) {
            throw new n8n_workflow_1.NodeOperationError(context.getNode(), `Upsert From Input matched ${previousRows.length} rows. Enable Allow Multiple Matches or use more specific Match Columns.`, { itemIndex });
        }
        if (previousRows.length > 0) {
            return [
                await updateExistingRows(db, tableIdentifier, row, matchColumns, whereClause, previousRows, returnPreviousRows),
            ];
        }
        return [await insertRow(db, tableIdentifier, row, returnPreviousRows)];
    });
}
async function getPreviousRows(db, tableIdentifier, whereClause) {
    let statement;
    const sql = `SELECT * FROM ${tableIdentifier} WHERE ${whereClause.sql}`;
    try {
        statement = await db.execute(sql, whereClause.parameters);
        if (!statement.isQuery()) {
            return [];
        }
        return await (0, sql_1.collectRows)(statement);
    }
    finally {
        statement === null || statement === void 0 ? void 0 : statement.close();
    }
}
async function updateExistingRows(db, tableIdentifier, row, matchColumns, whereClause, previousRows, returnPreviousRows) {
    const matchColumnSet = new Set(matchColumns);
    const updateColumns = Object.keys(row).filter((column) => !matchColumnSet.has(column));
    if (updateColumns.length === 0) {
        return buildResult('matched', 0, previousRows, returnPreviousRows);
    }
    const sql = [
        `UPDATE ${tableIdentifier}`,
        `SET ${updateColumns.map((column) => `${column} = ?`).join(', ')}`,
        `WHERE ${whereClause.sql}`,
    ].join(' ');
    const parameters = [...updateColumns.map((column) => row[column]), ...whereClause.parameters];
    const affectedRows = await db.update(sql, parameters);
    return buildResult('updated', affectedRows, previousRows, returnPreviousRows);
}
async function insertRow(db, tableIdentifier, row, returnPreviousRows) {
    const columns = Object.keys(row);
    const placeholders = columns.map(() => '?').join(', ');
    const sql = `INSERT INTO ${tableIdentifier} (${columns.join(', ')}) VALUES (${placeholders})`;
    const affectedRows = await db.update(sql, Object.values(row));
    return buildResult('inserted', affectedRows, [], returnPreviousRows);
}
function buildResult(action, affectedRows, previousRows, returnPreviousRows) {
    const result = {
        action,
        matchedRows: previousRows.length,
        affectedRows,
    };
    if (returnPreviousRows) {
        result.previousRows = previousRows;
    }
    return result;
}
function getInputRow(context, itemIndex, excludeColumns) {
    var _a, _b;
    const input = (_b = (_a = context.getInputData()[itemIndex]) === null || _a === void 0 ? void 0 : _a.json) !== null && _b !== void 0 ? _b : {};
    const row = {};
    for (const [column, value] of Object.entries(input)) {
        if (excludeColumns.has(column)) {
            continue;
        }
        const columnIdentifier = getIdentifier(context, column, itemIndex, `Input column "${column}"`);
        row[columnIdentifier] = (0, sql_1.parseParam)(context, value, itemIndex, `input.${column}`);
    }
    if (Object.keys(row).length === 0) {
        throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Input item has no columns to upsert after exclusions.', { itemIndex });
    }
    return row;
}
function getWhereClause(context, row, matchColumns, itemIndex) {
    const predicates = [];
    const parameters = [];
    for (const column of matchColumns) {
        if (!(column in row)) {
            throw new n8n_workflow_1.NodeOperationError(context.getNode(), `Match column "${column}" must exist in the input item and must not be excluded.`, { itemIndex });
        }
        if (row[column] === null) {
            predicates.push(`${column} IS NULL`);
            continue;
        }
        predicates.push(`${column} = ?`);
        parameters.push(row[column]);
    }
    return { sql: predicates.join(' AND '), parameters };
}
function getColumnList(context, name, itemIndex, label) {
    const value = (0, sql_1.getRequiredString)(context, name, itemIndex, label);
    const columns = value
        .split(',')
        .map((column) => column.trim())
        .filter((column) => column !== '')
        .map((column) => getIdentifier(context, column, itemIndex, label));
    const uniqueColumns = new Set(columns);
    if (uniqueColumns.size !== columns.length) {
        throw new n8n_workflow_1.NodeOperationError(context.getNode(), `${label} contains duplicate columns.`, {
            itemIndex,
        });
    }
    return columns;
}
function getOptionalColumnSet(context, name, itemIndex, label) {
    const value = context.getNodeParameter(name, itemIndex, '');
    if (value.trim() === '') {
        return new Set();
    }
    return new Set(value
        .split(',')
        .map((column) => column.trim())
        .filter((column) => column !== '')
        .map((column) => getIdentifier(context, column, itemIndex, label)));
}
function getQualifiedIdentifier(context, value, itemIndex, label) {
    if (QUALIFIED_IDENTIFIER_PATTERN.test(value)) {
        return value;
    }
    throw new n8n_workflow_1.NodeOperationError(context.getNode(), `${label} must be a valid DB2 identifier, for example MYLIB.CUSTOMERS.`, { itemIndex });
}
function getIdentifier(context, value, itemIndex, label) {
    if (IDENTIFIER_PATTERN.test(value)) {
        return value;
    }
    throw new n8n_workflow_1.NodeOperationError(context.getNode(), `${label} must be a valid DB2 column identifier, for example CUSTOMER_ID.`, { itemIndex });
}
//# sourceMappingURL=upsertFromInput.js.map