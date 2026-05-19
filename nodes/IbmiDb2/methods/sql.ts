import type { GenericValue, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import type { Metadata, Param, Statement } from 'node-jt400';

const ROW_FETCH_BUFFER_SIZE = 1000;
const INTEGER_TYPES = new Set(['SMALLINT', 'INTEGER']);
const FLOAT_TYPES = new Set(['REAL', 'FLOAT', 'DOUBLE']);
const BOOLEAN_TYPES = new Set(['BOOLEAN']);

const LEGACY_JSON_PARAMETER_NAMES: Record<string, string> = {
	parametersUi: 'parameters',
	parameterSetsUi: 'parameterSets',
	rowsUi: 'rows',
};

type ParameterField = {
	name?: unknown;
	setNumber?: unknown;
	rowNumber?: unknown;
	column?: unknown;
	valueType?: unknown;
	valueString?: unknown;
	valueNumber?: unknown;
	valueJson?: unknown;
};

export function getRequiredString(
	context: IExecuteFunctions,
	name: string,
	itemIndex: number,
	label: string,
): string {
	const value = context.getNodeParameter(name, itemIndex) as string;

	if (value.trim() === '') {
		throw new NodeOperationError(context.getNode(), `${label} must not be empty.`, { itemIndex });
	}

	return value;
}

export function getSqlParameters(
	context: IExecuteFunctions,
	itemIndex: number,
	name = 'parametersUi',
): Param[] {
	const fields = getParameterFields(context, name, itemIndex);

	if (fields.length > 0) {
		return fields.map((field, index) => {
			const parameterName = getOptionalString(field.name);

			if (parameterName !== '') {
				throw new NodeOperationError(
					context.getNode(),
					'Positional ? parameters must not use Name. Sort the parameter fields in placeholder order instead.',
					{ itemIndex },
				);
			}

			return parseParameterFieldValue(context, field, itemIndex, `parameters[${index}]`);
		});
	}

	const value = parseJsonParameter(context, getLegacyJsonParameterName(name), itemIndex);

	if (!Array.isArray(value)) {
		throw new NodeOperationError(context.getNode(), 'Positional ? parameters must be a list of values.', {
			itemIndex,
		});
	}

	return value.map((parameter, index) => parseParam(context, parameter, itemIndex, `parameters[${index}]`));
}

export function prepareSqlParameters(
	context: IExecuteFunctions,
	sql: string,
	itemIndex: number,
	name = 'parametersUi',
): { sql: string; parameters: Param[] } {
	const placeholders = replaceNamedPlaceholders(sql);

	if (placeholders.names.length === 0) {
		return { sql, parameters: getSqlParameters(context, itemIndex, name) };
	}

	if (placeholders.hasPositionalPlaceholders) {
		throw new NodeOperationError(
			context.getNode(),
			'Do not mix named placeholders like :id with positional ? placeholders in the same SQL statement.',
			{ itemIndex },
		);
	}

	const fields = getParameterFields(context, name, itemIndex);
	const value =
		fields.length > 0
			? getNamedParameterValues(context, fields, itemIndex, name)
			: parseJsonParameter(context, getLegacyJsonParameterName(name), itemIndex);

	if (!isPlainObject(value)) {
		throw new NodeOperationError(
			context.getNode(),
			'Named SQL placeholders require Parameters to provide named values, for example customerID = 101.',
			{ itemIndex },
		);
	}

	return {
		sql: placeholders.sql,
		parameters: placeholders.names.map((parameterName) =>
			getNamedParameter(context, value, parameterName, itemIndex, name),
		),
	};
}

export function getBatchParameters(
	context: IExecuteFunctions,
	itemIndex: number,
	name = 'parameterSetsUi',
): Param[][] {
	const fields = getParameterFields(context, name, itemIndex);

	if (fields.length > 0) {
		return getParameterSetFields(context, fields, itemIndex, name).map(({ fields: parameterFields, setNumber }) =>
			parameterFields.map((field, columnIndex) => {
				const parameterName = getOptionalString(field.name);

				if (parameterName !== '') {
					throw new NodeOperationError(
						context.getNode(),
						'Positional ? parameter sets must not use Name. Sort each set in placeholder order instead.',
						{ itemIndex },
					);
				}

				return parseParameterFieldValue(
					context,
					field,
					itemIndex,
					`parameterSets[${setNumber}][${columnIndex}]`,
				);
			}),
		);
	}

	const value = parseJsonParameter(context, getLegacyJsonParameterName(name), itemIndex);

	if (!Array.isArray(value)) {
		throw new NodeOperationError(context.getNode(), 'Parameter Sets must be a list of rows.', {
			itemIndex,
		});
	}

	return value.map((parameterSet, rowIndex) => {
		if (!Array.isArray(parameterSet)) {
			throw new NodeOperationError(
				context.getNode(),
				`Parameter Sets row ${rowIndex + 1} must be a list of values.`,
				{ itemIndex },
			);
		}

		return parameterSet.map((parameter, columnIndex) =>
			parseParam(context, parameter, itemIndex, `parameterSets[${rowIndex}][${columnIndex}]`),
		);
	});
}

export function prepareBatchParameters(
	context: IExecuteFunctions,
	sql: string,
	itemIndex: number,
	name = 'parameterSetsUi',
): { sql: string; parameterSets: Param[][] } {
	const placeholders = replaceNamedPlaceholders(sql);

	if (placeholders.names.length === 0) {
		return { sql, parameterSets: getBatchParameters(context, itemIndex, name) };
	}

	if (placeholders.hasPositionalPlaceholders) {
		throw new NodeOperationError(
			context.getNode(),
			'Do not mix named placeholders like :id with positional ? placeholders in the same SQL statement.',
			{ itemIndex },
		);
	}

	const fields = getParameterFields(context, name, itemIndex);
	const value =
		fields.length > 0
			? getNamedParameterSetValues(context, fields, itemIndex, name)
			: parseJsonParameter(context, getLegacyJsonParameterName(name), itemIndex);

	if (!Array.isArray(value)) {
		throw new NodeOperationError(context.getNode(), 'Parameter Sets must be a list of rows.', {
			itemIndex,
		});
	}

	return {
		sql: placeholders.sql,
		parameterSets: value.map((parameterSet, rowIndex) => {
			if (!isPlainObject(parameterSet)) {
				throw new NodeOperationError(
					context.getNode(),
					`Parameter Sets row ${rowIndex + 1} must provide named values.`,
					{ itemIndex },
				);
			}

			return placeholders.names.map((parameterName) =>
				getNamedParameter(
					context,
					parameterSet,
					parameterName,
					itemIndex,
					`${name}[${rowIndex}]`,
				),
			);
		}),
	};
}

export function getInsertRows(
	context: IExecuteFunctions,
	itemIndex: number,
	name = 'rowsUi',
): Record<string, Param>[] {
	const fields = getParameterFields(context, name, itemIndex);

	if (fields.length > 0) {
		return getRowFields(context, fields, itemIndex, name).map(({ fields: rowFields, rowNumber }) => {
			const row: Record<string, Param> = {};

			for (const [fieldIndex, field] of rowFields.entries()) {
				const column = getOptionalString(field.column);

				if (column === '') {
					throw new NodeOperationError(context.getNode(), `Rows row ${rowNumber} column is required.`, {
						itemIndex,
					});
				}

				if (column in row) {
					throw new NodeOperationError(
						context.getNode(),
						`Rows row ${rowNumber} contains duplicate column "${column}".`,
						{ itemIndex },
					);
				}

				row[column] = parseParameterFieldValue(
					context,
					field,
					itemIndex,
					`rows[${rowNumber}][${fieldIndex}]`,
				);
			}

			return row;
		});
	}

	const value = parseJsonParameter(context, getLegacyJsonParameterName(name), itemIndex);

	if (!Array.isArray(value)) {
		throw new NodeOperationError(context.getNode(), 'Rows must be a list of objects.', {
			itemIndex,
		});
	}

	return value.map((row, rowIndex) => {
		if (!isPlainObject(row)) {
			throw new NodeOperationError(context.getNode(), `Rows row ${rowIndex + 1} must be an object.`, {
				itemIndex,
			});
		}

		return Object.entries(row).reduce<Record<string, Param>>((result, [column, value]) => {
			result[column] = parseParam(context, value, itemIndex, `rows[${rowIndex}].${column}`);
			return result;
		}, {});
	});
}

export async function collectRows(statement: Statement): Promise<IDataObject[]> {
	const rows: IDataObject[] = [];
	const [metadata, rowStream] = await Promise.all([
		statement.metadata(),
		statement.asObjectStream({ bufferSize: ROW_FETCH_BUFFER_SIZE }),
	]);

	for await (const row of rowStream) {
		rows.push(parseRow(row, metadata));
	}

	return rows;
}

export async function collectStreamRows(
	stream: NodeJS.ReadableStream,
): Promise<IDataObject[]> {
	return await new Promise<IDataObject[]>((resolve, reject) => {
		const rows: IDataObject[] = [];

		stream.on('data', (row: Record<string, GenericValue>) => {
			rows.push(row);
		});
		stream.on('end', () => resolve(rows));
		stream.on('error', reject);
	});
}

function getParameterFields(
	context: IExecuteFunctions,
	name: string,
	itemIndex: number,
): ParameterField[] {
	const value = context.getNodeParameter(name, itemIndex, { values: [] }) as unknown;

	if (!isPlainObject(value)) {
		return [];
	}

	const values = value.values;

	if (!Array.isArray(values)) {
		return [];
	}

	return values.filter(isPlainObject);
}

function getNamedParameterValues(
	context: IExecuteFunctions,
	fields: ParameterField[],
	itemIndex: number,
	path: string,
): Record<string, Param> {
	return fields.reduce<Record<string, Param>>((parameters, field, index) => {
		const parameterName = getOptionalString(field.name);

		if (parameterName === '') {
			throw new NodeOperationError(context.getNode(), 'Named SQL parameters require Name.', {
				itemIndex,
			});
		}

		if (parameterName in parameters) {
			throw new NodeOperationError(
				context.getNode(),
				`Parameters contains duplicate name "${parameterName}".`,
				{ itemIndex },
			);
		}

		parameters[parameterName] = parseParameterFieldValue(
			context,
			field,
			itemIndex,
			`${path}[${index}]`,
		);
		return parameters;
	}, {});
}

function getNamedParameterSetValues(
	context: IExecuteFunctions,
	fields: ParameterField[],
	itemIndex: number,
	path: string,
): Record<string, Param>[] {
	return getParameterSetFields(context, fields, itemIndex, path).map(
		({ fields: parameterFields, setNumber }) => {
			const parameters: Record<string, Param> = {};

			for (const [fieldIndex, field] of parameterFields.entries()) {
				const parameterName = getOptionalString(field.name);

				if (parameterName === '') {
					throw new NodeOperationError(
						context.getNode(),
						`Parameter Sets row ${setNumber} requires Name for named SQL parameters.`,
						{ itemIndex },
					);
				}

				if (parameterName in parameters) {
					throw new NodeOperationError(
						context.getNode(),
						`Parameter Sets row ${setNumber} contains duplicate name "${parameterName}".`,
						{ itemIndex },
					);
				}

				parameters[parameterName] = parseParameterFieldValue(
					context,
					field,
					itemIndex,
					`${path}[${setNumber}][${fieldIndex}]`,
				);
			}

			return parameters;
		},
	);
}

function getParameterSetFields(
	context: IExecuteFunctions,
	fields: ParameterField[],
	itemIndex: number,
	path: string,
): Array<{ setNumber: number; fields: ParameterField[] }> {
	return groupFieldsByIndex(context, fields, itemIndex, path, 'setNumber', 'Set Number').map(
		({ index, fields }) => ({ setNumber: index, fields }),
	);
}

function getRowFields(
	context: IExecuteFunctions,
	fields: ParameterField[],
	itemIndex: number,
	path: string,
): Array<{ rowNumber: number; fields: ParameterField[] }> {
	return groupFieldsByIndex(context, fields, itemIndex, path, 'rowNumber', 'Row Number').map(
		({ index, fields }) => ({ rowNumber: index, fields }),
	);
}

function groupFieldsByIndex(
	context: IExecuteFunctions,
	fields: ParameterField[],
	itemIndex: number,
	path: string,
	indexProperty: 'setNumber' | 'rowNumber',
	indexLabel: string,
): Array<{ index: number; fields: ParameterField[] }> {
	const fieldGroups = new Map<number, ParameterField[]>();

	for (const [fieldIndex, field] of fields.entries()) {
		const index = getPositiveInteger(
			context,
			field[indexProperty],
			itemIndex,
			`${path}[${fieldIndex}].${indexLabel}`,
		);
		const fieldGroup = fieldGroups.get(index) ?? [];

		fieldGroup.push(field);
		fieldGroups.set(index, fieldGroup);
	}

	return Array.from(fieldGroups.entries())
		.sort(([left], [right]) => left - right)
		.map(([index, fields]) => ({ index, fields }));
}

function parseParameterFieldValue(
	context: IExecuteFunctions,
	field: ParameterField,
	itemIndex: number,
	path: string,
): Param {
	switch (field.valueType ?? 'string') {
		case 'string':
			return parseParam(context, field.valueString ?? '', itemIndex, path);
		case 'number':
			return parseParam(context, field.valueNumber, itemIndex, path);
		case 'null':
			return null;
		case 'json':
			return parseParam(context, parseJsonValue(context, field.valueJson, itemIndex, path), itemIndex, path);
		default:
			throw new NodeOperationError(context.getNode(), `${path} has an unsupported value type.`, {
				itemIndex,
			});
	}
}

function parseJsonValue(
	context: IExecuteFunctions,
	value: unknown,
	itemIndex: number,
	path: string,
): unknown {
	if (typeof value !== 'string') {
		return value;
	}

	try {
		return JSON.parse(value);
	} catch {
		throw new NodeOperationError(context.getNode(), `${path} must contain valid JSON.`, {
			itemIndex,
		});
	}
}

function parseJsonParameter(
	context: IExecuteFunctions,
	name: string,
	itemIndex: number,
): unknown {
	const value = context.getNodeParameter(name, itemIndex, '[]');

	return parseJsonValue(context, value, itemIndex, name);
}

function getLegacyJsonParameterName(name: string): string {
	return LEGACY_JSON_PARAMETER_NAMES[name] ?? name;
}

function getPositiveInteger(
	context: IExecuteFunctions,
	value: unknown,
	itemIndex: number,
	path: string,
): number {
	const parsed = typeof value === 'number' ? value : Number(value);

	if (!Number.isInteger(parsed) || parsed < 1) {
		throw new NodeOperationError(context.getNode(), `${path} must be a positive integer.`, {
			itemIndex,
		});
	}

	return parsed;
}

function getOptionalString(value: unknown): string {
	return typeof value === 'string' ? value.trim() : '';
}

function parseParam(
	context: IExecuteFunctions,
	value: unknown,
	itemIndex: number,
	path: string,
): Param {
	if (
		value === null ||
		typeof value === 'string' ||
		typeof value === 'number' ||
		value instanceof Date
	) {
		return value;
	}

	if (isComplexParam(value)) {
		return value;
	}

	throw new NodeOperationError(
		context.getNode(),
		`${path} must be a string, number, null, Date, CLOB object, or BLOB object.`,
		{ itemIndex },
	);
}

function getNamedParameter(
	context: IExecuteFunctions,
	parameters: Record<string, unknown>,
	parameterName: string,
	itemIndex: number,
	path: string,
): Param {
	if (!(parameterName in parameters)) {
		throw new NodeOperationError(
			context.getNode(),
			`Missing value for named SQL parameter :${parameterName}.`,
			{ itemIndex },
		);
	}

	return parseParam(context, parameters[parameterName], itemIndex, `${path}.${parameterName}`);
}

function replaceNamedPlaceholders(sql: string): {
	sql: string;
	names: string[];
	hasPositionalPlaceholders: boolean;
} {
	const names: string[] = [];
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

function copyQuotedSection(sql: string, startIndex: number, quote: "'" | '"'): number {
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

function copyLineComment(sql: string, startIndex: number): number {
	const lineBreakIndex = sql.indexOf('\n', startIndex + 2);
	return lineBreakIndex === -1 ? sql.length : lineBreakIndex;
}

function copyBlockComment(sql: string, startIndex: number): number {
	const commentEndIndex = sql.indexOf('*/', startIndex + 2);
	return commentEndIndex === -1 ? sql.length : commentEndIndex + 2;
}

function isIdentifierStart(value: string | undefined): boolean {
	return value !== undefined && /[A-Za-z_]/.test(value);
}

function isIdentifierPart(value: string | undefined): boolean {
	return value !== undefined && /[A-Za-z0-9_]/.test(value);
}

function isComplexParam(value: unknown): value is Extract<Param, object> {
	if (!isPlainObject(value)) {
		return false;
	}

	return (
		(value.type === 'CLOB' || value.type === 'BLOB') &&
		typeof value.value === 'string' &&
		Object.keys(value).length === 2
	);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseRow(row: Record<string, GenericValue>, metadata: Metadata[]): IDataObject {
	return metadata.reduce<IDataObject>((result, column) => {
		result[column.name] = parseValue(row[column.name], column);
		return result;
	}, {});
}

function parseValue(value: GenericValue, column: Metadata): GenericValue {
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
