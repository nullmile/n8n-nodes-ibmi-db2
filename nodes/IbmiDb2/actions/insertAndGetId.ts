import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

import { withWriteDatabase } from '../methods/database';
import { getRequiredString, prepareSqlParameters } from '../methods/sql';

export async function insertAndGetId(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject[]> {
	const rawSql = getRequiredString(context, 'insertSql', itemIndex, 'Insert SQL');
	const { sql, parameters } = prepareSqlParameters(context, rawSql, itemIndex);

	return await withWriteDatabase(context, itemIndex, async (db) => [
		{ insertId: await db.insertAndGetId(sql, parameters) },
	]);
}
