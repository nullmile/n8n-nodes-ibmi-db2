import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

import { withWriteDatabase } from '../methods/database';
import { getRequiredString, prepareSqlParameters } from '../methods/sql';

export async function updateRows(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject[]> {
	const rawSql = getRequiredString(context, 'updateSql', itemIndex, 'Update SQL');
	const { sql, parameters } = prepareSqlParameters(context, rawSql, itemIndex);

	return await withWriteDatabase(context, itemIndex, async (db) => [
		{ affectedRows: await db.update(sql, parameters) },
	]);
}
