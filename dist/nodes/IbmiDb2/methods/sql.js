"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequiredString = getRequiredString;
exports.getSqlParameters = getSqlParameters;
exports.prepareSqlParameters = prepareSqlParameters;
exports.getBatchParameters = getBatchParameters;
exports.prepareBatchParameters = prepareBatchParameters;
exports.getInsertRows = getInsertRows;
exports.collectRows = collectRows;
exports.collectStreamRows = collectStreamRows;
const n8n_workflow_1 = require("n8n-workflow");
const ROW_FETCH_BUFFER_SIZE = 1000;
const INTEGER_TYPES = new Set(['SMALLINT', 'INTEGER']);
const FLOAT_TYPES = new Set(['REAL', 'FLOAT', 'DOUBLE']);
const BOOLEAN_TYPES = new Set(['BOOLEAN']);
const LEGACY_JSON_PARAMETER_NAMES = {
    parametersUi: 'parameters',
    parameterSetsUi: 'parameterSets',
    rowsUi: 'rows',
};
function getRequiredString(context, name, itemIndex, label) {
    const value = context.getNodeParameter(name, itemIndex);
    if (value.trim() === '') {
        throw new n8n_workflow_1.NodeOperationError(context.getNode(), `${label} must not be empty.`, { itemIndex });
    }
    return value;
}
function getSqlParameters(context, itemIndex, name = 'parametersUi') {
    const fields = getParameterFields(context, name, itemIndex);
    if (fields.length > 0) {
        return fields.map((field, index) => {
            const parameterName = getOptionalString(field.name);
            if (parameterName !== '') {
                throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Positional ? parameters must not use Name. Sort the parameter fields in placeholder order instead.', { itemIndex });
            }
            return parseParameterFieldValue(context, field, itemIndex, `parameters[${index}]`);
        });
    }
    const value = parseJsonParameter(context, getLegacyJsonParameterName(name), itemIndex);
    if (!Array.isArray(value)) {
        throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Positional ? parameters must be a list of values.', {
            itemIndex,
        });
    }
    return value.map((parameter, index) => parseParam(context, parameter, itemIndex, `parameters[${index}]`));
}
function prepareSqlParameters(context, sql, itemIndex, name = 'parametersUi') {
    const placeholders = replaceNamedPlaceholders(sql);
    if (placeholders.names.length === 0) {
        return { sql, parameters: getSqlParameters(context, itemIndex, name) };
    }
    if (placeholders.hasPositionalPlaceholders) {
        throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Do not mix named placeholders like :id with positional ? placeholders in the same SQL statement.', { itemIndex });
    }
    const fields = getParameterFields(context, name, itemIndex);
    const value = fields.length > 0
        ? getNamedParameterValues(context, fields, itemIndex, name)
        : parseJsonParameter(context, getLegacyJsonParameterName(name), itemIndex);
    if (!isPlainObject(value)) {
        throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Named SQL placeholders require Parameters to provide named values, for example customerID = 101.', { itemIndex });
    }
    return {
        sql: placeholders.sql,
        parameters: placeholders.names.map((parameterName) => getNamedParameter(context, value, parameterName, itemIndex, name)),
    };
}
function getBatchParameters(context, itemIndex, name = 'parameterSetsUi') {
    const fields = getParameterFields(context, name, itemIndex);
    if (fields.length > 0) {
        return getParameterSetFields(context, fields, itemIndex, name).map(({ fields: parameterFields, setNumber }) => parameterFields.map((field, columnIndex) => {
            const parameterName = getOptionalString(field.name);
            if (parameterName !== '') {
                throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Positional ? parameter sets must not use Name. Sort each set in placeholder order instead.', { itemIndex });
            }
            return parseParameterFieldValue(context, field, itemIndex, `parameterSets[${setNumber}][${columnIndex}]`);
        }));
    }
    const value = parseJsonParameter(context, getLegacyJsonParameterName(name), itemIndex);
    if (!Array.isArray(value)) {
        throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Parameter Sets must be a list of rows.', {
            itemIndex,
        });
    }
    return value.map((parameterSet, rowIndex) => {
        if (!Array.isArray(parameterSet)) {
            throw new n8n_workflow_1.NodeOperationError(context.getNode(), `Parameter Sets row ${rowIndex + 1} must be a list of values.`, { itemIndex });
        }
        return parameterSet.map((parameter, columnIndex) => parseParam(context, parameter, itemIndex, `parameterSets[${rowIndex}][${columnIndex}]`));
    });
}
function prepareBatchParameters(context, sql, itemIndex, name = 'parameterSetsUi') {
    const placeholders = replaceNamedPlaceholders(sql);
    if (placeholders.names.length === 0) {
        return { sql, parameterSets: getBatchParameters(context, itemIndex, name) };
    }
    if (placeholders.hasPositionalPlaceholders) {
        throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Do not mix named placeholders like :id with positional ? placeholders in the same SQL statement.', { itemIndex });
    }
    const fields = getParameterFields(context, name, itemIndex);
    const value = fields.length > 0
        ? getNamedParameterSetValues(context, fields, itemIndex, name)
        : parseJsonParameter(context, getLegacyJsonParameterName(name), itemIndex);
    if (!Array.isArray(value)) {
        throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Parameter Sets must be a list of rows.', {
            itemIndex,
        });
    }
    return {
        sql: placeholders.sql,
        parameterSets: value.map((parameterSet, rowIndex) => {
            if (!isPlainObject(parameterSet)) {
                throw new n8n_workflow_1.NodeOperationError(context.getNode(), `Parameter Sets row ${rowIndex + 1} must provide named values.`, { itemIndex });
            }
            return placeholders.names.map((parameterName) => getNamedParameter(context, parameterSet, parameterName, itemIndex, `${name}[${rowIndex}]`));
        }),
    };
}
function getInsertRows(context, itemIndex, name = 'rowsUi') {
    const fields = getParameterFields(context, name, itemIndex);
    if (fields.length > 0) {
        return getRowFields(context, fields, itemIndex, name).map(({ fields: rowFields, rowNumber }) => {
            const row = {};
            for (const [fieldIndex, field] of rowFields.entries()) {
                const column = getOptionalString(field.column);
                if (column === '') {
                    throw new n8n_workflow_1.NodeOperationError(context.getNode(), `Rows row ${rowNumber} column is required.`, {
                        itemIndex,
                    });
                }
                if (column in row) {
                    throw new n8n_workflow_1.NodeOperationError(context.getNode(), `Rows row ${rowNumber} contains duplicate column "${column}".`, { itemIndex });
                }
                row[column] = parseParameterFieldValue(context, field, itemIndex, `rows[${rowNumber}][${fieldIndex}]`);
            }
            return row;
        });
    }
    const value = parseJsonParameter(context, getLegacyJsonParameterName(name), itemIndex);
    if (!Array.isArray(value)) {
        throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Rows must be a list of objects.', {
            itemIndex,
        });
    }
    return value.map((row, rowIndex) => {
        if (!isPlainObject(row)) {
            throw new n8n_workflow_1.NodeOperationError(context.getNode(), `Rows row ${rowIndex + 1} must be an object.`, {
                itemIndex,
            });
        }
        return Object.entries(row).reduce((result, [column, value]) => {
            result[column] = parseParam(context, value, itemIndex, `rows[${rowIndex}].${column}`);
            return result;
        }, {});
    });
}
async function collectRows(statement) {
    const rows = [];
    const [metadata, rowStream] = await Promise.all([
        statement.metadata(),
        statement.asObjectStream({ bufferSize: ROW_FETCH_BUFFER_SIZE }),
    ]);
    for await (const row of rowStream) {
        rows.push(parseRow(row, metadata));
    }
    return rows;
}
async function collectStreamRows(stream) {
    return await new Promise((resolve, reject) => {
        const rows = [];
        stream.on('data', (row) => {
            rows.push(row);
        });
        stream.on('end', () => resolve(rows));
        stream.on('error', reject);
    });
}
function getParameterFields(context, name, itemIndex) {
    const value = context.getNodeParameter(name, itemIndex, { values: [] });
    if (!isPlainObject(value)) {
        return [];
    }
    const values = value.values;
    if (!Array.isArray(values)) {
        return [];
    }
    return values.filter(isPlainObject);
}
function getNamedParameterValues(context, fields, itemIndex, path) {
    return fields.reduce((parameters, field, index) => {
        const parameterName = getOptionalString(field.name);
        if (parameterName === '') {
            throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Named SQL parameters require Name.', {
                itemIndex,
            });
        }
        if (parameterName in parameters) {
            throw new n8n_workflow_1.NodeOperationError(context.getNode(), `Parameters contains duplicate name "${parameterName}".`, { itemIndex });
        }
        parameters[parameterName] = parseParameterFieldValue(context, field, itemIndex, `${path}[${index}]`);
        return parameters;
    }, {});
}
function getNamedParameterSetValues(context, fields, itemIndex, path) {
    return getParameterSetFields(context, fields, itemIndex, path).map(({ fields: parameterFields, setNumber }) => {
        const parameters = {};
        for (const [fieldIndex, field] of parameterFields.entries()) {
            const parameterName = getOptionalString(field.name);
            if (parameterName === '') {
                throw new n8n_workflow_1.NodeOperationError(context.getNode(), `Parameter Sets row ${setNumber} requires Name for named SQL parameters.`, { itemIndex });
            }
            if (parameterName in parameters) {
                throw new n8n_workflow_1.NodeOperationError(context.getNode(), `Parameter Sets row ${setNumber} contains duplicate name "${parameterName}".`, { itemIndex });
            }
            parameters[parameterName] = parseParameterFieldValue(context, field, itemIndex, `${path}[${setNumber}][${fieldIndex}]`);
        }
        return parameters;
    });
}
function getParameterSetFields(context, fields, itemIndex, path) {
    return groupFieldsByIndex(context, fields, itemIndex, path, 'setNumber', 'Set Number').map(({ index, fields }) => ({ setNumber: index, fields }));
}
function getRowFields(context, fields, itemIndex, path) {
    return groupFieldsByIndex(context, fields, itemIndex, path, 'rowNumber', 'Row Number').map(({ index, fields }) => ({ rowNumber: index, fields }));
}
function groupFieldsByIndex(context, fields, itemIndex, path, indexProperty, indexLabel) {
    var _a;
    const fieldGroups = new Map();
    for (const [fieldIndex, field] of fields.entries()) {
        const index = getPositiveInteger(context, field[indexProperty], itemIndex, `${path}[${fieldIndex}].${indexLabel}`);
        const fieldGroup = (_a = fieldGroups.get(index)) !== null && _a !== void 0 ? _a : [];
        fieldGroup.push(field);
        fieldGroups.set(index, fieldGroup);
    }
    return Array.from(fieldGroups.entries())
        .sort(([left], [right]) => left - right)
        .map(([index, fields]) => ({ index, fields }));
}
function parseParameterFieldValue(context, field, itemIndex, path) {
    var _a, _b;
    switch ((_a = field.valueType) !== null && _a !== void 0 ? _a : 'string') {
        case 'string':
            return parseParam(context, (_b = field.valueString) !== null && _b !== void 0 ? _b : '', itemIndex, path);
        case 'number':
            return parseParam(context, field.valueNumber, itemIndex, path);
        case 'null':
            return null;
        case 'json':
            return parseParam(context, parseJsonValue(context, field.valueJson, itemIndex, path), itemIndex, path);
        default:
            throw new n8n_workflow_1.NodeOperationError(context.getNode(), `${path} has an unsupported value type.`, {
                itemIndex,
            });
    }
}
function parseJsonValue(context, value, itemIndex, path) {
    if (typeof value !== 'string') {
        return value;
    }
    try {
        return JSON.parse(value);
    }
    catch {
        throw new n8n_workflow_1.NodeOperationError(context.getNode(), `${path} must contain valid JSON.`, {
            itemIndex,
        });
    }
}
function parseJsonParameter(context, name, itemIndex) {
    const value = context.getNodeParameter(name, itemIndex, '[]');
    return parseJsonValue(context, value, itemIndex, name);
}
function getLegacyJsonParameterName(name) {
    var _a;
    return (_a = LEGACY_JSON_PARAMETER_NAMES[name]) !== null && _a !== void 0 ? _a : name;
}
function getPositiveInteger(context, value, itemIndex, path) {
    const parsed = typeof value === 'number' ? value : Number(value);
    if (!Number.isInteger(parsed) || parsed < 1) {
        throw new n8n_workflow_1.NodeOperationError(context.getNode(), `${path} must be a positive integer.`, {
            itemIndex,
        });
    }
    return parsed;
}
function getOptionalString(value) {
    return typeof value === 'string' ? value.trim() : '';
}
function parseParam(context, value, itemIndex, path) {
    if (value === null ||
        typeof value === 'string' ||
        typeof value === 'number' ||
        value instanceof Date) {
        return value;
    }
    if (isComplexParam(value)) {
        return value;
    }
    throw new n8n_workflow_1.NodeOperationError(context.getNode(), `${path} must be a string, number, null, Date, CLOB object, or BLOB object.`, { itemIndex });
}
function getNamedParameter(context, parameters, parameterName, itemIndex, path) {
    if (!(parameterName in parameters)) {
        throw new n8n_workflow_1.NodeOperationError(context.getNode(), `Missing value for named SQL parameter :${parameterName}.`, { itemIndex });
    }
    return parseParam(context, parameters[parameterName], itemIndex, `${path}.${parameterName}`);
}
function replaceNamedPlaceholders(sql) {
    const names = [];
    let hasPositionalPlaceholders = false;
    let result = '';
    let index = 0;
    while (index < sql.length) {
        const character = sql[index];
        const nextCharacter = sql[index + 1];
        if (character === "'") {
            const endIndex = copyQuotedSection(sql, index, "'");
            result += sql.slice(index, endIndex);
            index = endIndex;
            continue;
        }
        if (character === '"') {
            const endIndex = copyQuotedSection(sql, index, '"');
            result += sql.slice(index, endIndex);
            index = endIndex;
            continue;
        }
        if (character === '-' && nextCharacter === '-') {
            const endIndex = copyLineComment(sql, index);
            result += sql.slice(index, endIndex);
            index = endIndex;
            continue;
        }
        if (character === '/' && nextCharacter === '*') {
            const endIndex = copyBlockComment(sql, index);
            result += sql.slice(index, endIndex);
            index = endIndex;
            continue;
        }
        if (character === '?') {
            hasPositionalPlaceholders = true;
            result += character;
            index++;
            continue;
        }
        if (character === ':' && isIdentifierStart(nextCharacter)) {
            let endIndex = index + 2;
            while (isIdentifierPart(sql[endIndex])) {
                endIndex++;
            }
            names.push(sql.slice(index + 1, endIndex));
            result += '?';
            index = endIndex;
            continue;
        }
        result += character;
        index++;
    }
    return { sql: result, names, hasPositionalPlaceholders };
}
function copyQuotedSection(sql, startIndex, quote) {
    let index = startIndex + 1;
    while (index < sql.length) {
        if (sql[index] === quote) {
            if (sql[index + 1] === quote) {
                index += 2;
                continue;
            }
            return index + 1;
        }
        index++;
    }
    return sql.length;
}
function copyLineComment(sql, startIndex) {
    const lineBreakIndex = sql.indexOf('\n', startIndex + 2);
    return lineBreakIndex === -1 ? sql.length : lineBreakIndex;
}
function copyBlockComment(sql, startIndex) {
    const commentEndIndex = sql.indexOf('*/', startIndex + 2);
    return commentEndIndex === -1 ? sql.length : commentEndIndex + 2;
}
function isIdentifierStart(value) {
    return value !== undefined && /[A-Za-z_]/.test(value);
}
function isIdentifierPart(value) {
    return value !== undefined && /[A-Za-z0-9_]/.test(value);
}
function isComplexParam(value) {
    if (!isPlainObject(value)) {
        return false;
    }
    return ((value.type === 'CLOB' || value.type === 'BLOB') &&
        typeof value.value === 'string' &&
        Object.keys(value).length === 2);
}
function isPlainObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function parseRow(row, metadata) {
    return metadata.reduce((result, column) => {
        result[column.name] = parseValue(row[column.name], column);
        return result;
    }, {});
}
function parseValue(value, column) {
    if (value === null || value === undefined || typeof value !== 'string') {
        return value;
    }
    const typeName = column.typeName.toUpperCase();
    if (INTEGER_TYPES.has(typeName)) {
        const parsed = Number(value);
        return Number.isSafeInteger(parsed) ? parsed : value;
    }
    if (FLOAT_TYPES.has(typeName)) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : value;
    }
    if (BOOLEAN_TYPES.has(typeName)) {
        if (value === '1' || value.toLowerCase() === 'true') {
            return true;
        }
        if (value === '0' || value.toLowerCase() === 'false') {
            return false;
        }
    }
    return value;
}
//# sourceMappingURL=sql.js.map