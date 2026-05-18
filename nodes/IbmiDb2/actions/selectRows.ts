import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import type { Statement } from 'node-jt400';

import { withDatabase } from '../methods/database';
import { collectRows, getRequiredString, prepareSqlParameters } from '../methods/sql';

export async function selectRows(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject[]> {
	const rawSql = getRequiredString(context, 'selectSql', itemIndex, 'SELECT SQL');
	const { sql, parameters } = prepareSqlParameters(context, rawSql, itemIndex);
	let statement: Statement | undefined;

	return await withDatabase(context, async (db) => {
		const activeStatement = await db.execute(sql, parameters);
		statement = activeStatement;

		if (!activeStatement.isQuery()) {
			throw new NodeOperationError(context.getNode(), 'Select must use a query statement.', {
				itemIndex,
			});
		}

		return await collectRows(activeStatement);
	}).finally(() => {
		statement?.close();
	});
}
