import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { withWriteDatabase } from '../methods/database';
import { collectRows, getRequiredString, parseParam, type Param, type Statement } from '../methods/sql';

type UpsertAction = 'inserted' | 'updated' | 'matched';

type UpsertConnection = {
	execute(sql: string, params?: Param[]): Promise<Statement>;
	update(sql: string, params?: Param[]): Promise<number>;
};

type WhereClause = {
	sql: string;
	parameters: Param[];
};

const IDENTIFIER_SEGMENT_PATTERN = '(?:[A-Za-z_@$#][A-Za-z0-9_@$#]*|"(?:""|[^"])+")';
const IDENTIFIER_PATTERN = new RegExp(`^${IDENTIFIER_SEGMENT_PATTERN}$`);
const QUALIFIED_IDENTIFIER_PATTERN = new RegExp(
	`^${IDENTIFIER_SEGMENT_PATTERN}(?:\\.${IDENTIFIER_SEGMENT_PATTERN})*$`,
);

export async function upsertFromInput(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject[]> {
	const tableName = getRequiredString(context, 'tableName', itemIndex, 'Table Name');
	const tableIdentifier = getQualifiedIdentifier(context, tableName, itemIndex, 'Table Name');
	const matchColumns = getColumnList(context, 'matchColumns', itemIndex, 'Match Columns');
	const excludeColumns = getOptionalColumnSet(context, 'excludeColumns', itemIndex, 'Columns to Exclude');
	const returnPreviousRows = context.getNodeParameter(
		'returnPreviousRows',
		itemIndex,
		false,
	) as boolean;
	const allowMultipleMatches = context.getNodeParameter(
		'allowMultipleMatches',
		itemIndex,
		false,
	) as boolean;
	const row = getInputRow(context, itemIndex, excludeColumns);
	const whereClause = getWhereClause(context, row, matchColumns, itemIndex);

	return await withWriteDatabase(context, itemIndex, async (db) => {
		const previousRows = await getPreviousRows(db, tableIdentifier, whereClause);

		if (previousRows.length > 1 && !allowMultipleMatches) {
			throw new NodeOperationError(
				context.getNode(),
				`Upsert From Input matched ${previousRows.length} rows. Enable Allow Multiple Matches or use more specific Match Columns.`,
				{ itemIndex },
			);
		}

		if (previousRows.length > 0) {
			return [
				await updateExistingRows(
					db,
					tableIdentifier,
					row,
					matchColumns,
					whereClause,
					previousRows,
					returnPreviousRows,
				),
			];
		}

		return [await insertRow(db, tableIdentifier, row, returnPreviousRows)];
	});
}

async function getPreviousRows(
	db: UpsertConnection,
	tableIdentifier: string,
	whereClause: WhereClause,
): Promise<IDataObject[]> {
	let statement: Statement | undefined;
	const sql = `SELECT * FROM ${tableIdentifier} WHERE ${whereClause.sql}`;

	try {
		statement = await db.execute(sql, whereClause.parameters);

		if (!statement.isQuery()) {
			return [];
		}

		return await collectRows(statement);
	} finally {
		statement?.close();
	}
}

async function updateExistingRows(
	db: UpsertConnection,
	tableIdentifier: string,
	row: Record<string, Param>,
	matchColumns: string[],
	whereClause: WhereClause,
	previousRows: IDataObject[],
	returnPreviousRows: boolean,
): Promise<IDataObject> {
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

async function insertRow(
	db: UpsertConnection,
	tableIdentifier: string,
	row: Record<string, Param>,
	returnPreviousRows: boolean,
): Promise<IDataObject> {
	const columns = Object.keys(row);
	const placeholders = columns.map(() => '?').join(', ');
	const sql = `INSERT INTO ${tableIdentifier} (${columns.join(', ')}) VALUES (${placeholders})`;
	const affectedRows = await db.update(sql, Object.values(row));

	return buildResult('inserted', affectedRows, [], returnPreviousRows);
}

function buildResult(
	action: UpsertAction,
	affectedRows: number,
	previousRows: IDataObject[],
	returnPreviousRows: boolean,
): IDataObject {
	const result: IDataObject = {
		action,
		matchedRows: previousRows.length,
		affectedRows,
	};

	if (returnPreviousRows) {
		result.previousRows = previousRows;
	}

	return result;
}

function getInputRow(
	context: IExecuteFunctions,
	itemIndex: number,
	excludeColumns: Set<string>,
): Record<string, Param> {
	const input = context.getInputData()[itemIndex]?.json ?? {};
	const row: Record<string, Param> = {};

	for (const [column, value] of Object.entries(input)) {
		if (excludeColumns.has(column)) {
			continue;
		}

		const columnIdentifier = getIdentifier(context, column, itemIndex, `Input column "${column}"`);
		row[columnIdentifier] = parseParam(context, value, itemIndex, `input.${column}`);
	}

	if (Object.keys(row).length === 0) {
		throw new NodeOperationError(
			context.getNode(),
			'Input item has no columns to upsert after exclusions.',
			{ itemIndex },
		);
	}

	return row;
}

function getWhereClause(
	context: IExecuteFunctions,
	row: Record<string, Param>,
	matchColumns: string[],
	itemIndex: number,
): WhereClause {
	const predicates: string[] = [];
	const parameters: Param[] = [];

	for (const column of matchColumns) {
		if (!(column in row)) {
			throw new NodeOperationError(
				context.getNode(),
				`Match column "${column}" must exist in the input item and must not be excluded.`,
				{ itemIndex },
			);
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

function getColumnList(
	context: IExecuteFunctions,
	name: string,
	itemIndex: number,
	label: string,
): string[] {
	const value = getRequiredString(context, name, itemIndex, label);
	const columns = value
		.split(',')
		.map((column) => column.trim())
		.filter((column) => column !== '')
		.map((column) => getIdentifier(context, column, itemIndex, label));
	const uniqueColumns = new Set(columns);

	if (uniqueColumns.size !== columns.length) {
		throw new NodeOperationError(context.getNode(), `${label} contains duplicate columns.`, {
			itemIndex,
		});
	}

	return columns;
}

function getOptionalColumnSet(
	context: IExecuteFunctions,
	name: string,
	itemIndex: number,
	label: string,
): Set<string> {
	const value = context.getNodeParameter(name, itemIndex, '') as string;

	if (value.trim() === '') {
		return new Set();
	}

	return new Set(
		value
			.split(',')
			.map((column) => column.trim())
			.filter((column) => column !== '')
			.map((column) => getIdentifier(context, column, itemIndex, label)),
	);
}

function getQualifiedIdentifier(
	context: IExecuteFunctions,
	value: string,
	itemIndex: number,
	label: string,
): string {
	if (QUALIFIED_IDENTIFIER_PATTERN.test(value)) {
		return value;
	}

	throw new NodeOperationError(
		context.getNode(),
		`${label} must be a valid DB2 identifier, for example MYLIB.CUSTOMERS.`,
		{ itemIndex },
	);
}

function getIdentifier(
	context: IExecuteFunctions,
	value: string,
	itemIndex: number,
	label: string,
): string {
	if (IDENTIFIER_PATTERN.test(value)) {
		return value;
	}

	throw new NodeOperationError(
		context.getNode(),
		`${label} must be a valid DB2 column identifier, for example CUSTOMER_ID.`,
		{ itemIndex },
	);
}
