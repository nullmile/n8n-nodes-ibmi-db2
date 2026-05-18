import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

import type { Statement } from 'node-jt400';

import { withWriteDatabase } from '../methods/database';
import { collectRows, getRequiredString, prepareSqlParameters } from '../methods/sql';

export async function executeSql(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject[]> {
	const rawSql = getRequiredString(context, 'sql', itemIndex, 'SQL');
	const { sql, parameters } = prepareSqlParameters(context, rawSql, itemIndex);
	let statement: Statement | undefined;

	return await withWriteDatabase(context, itemIndex, async (db) => {
		const activeStatement = await db.execute(sql, parameters);
		statement = activeStatement;

		if (!activeStatement.isQuery()) {
			return [{ affectedRows: await activeStatement.updated() }];
		}

		return await collectRows(activeStatement);
	}).finally(() => {
		statement?.close();
	});
}
