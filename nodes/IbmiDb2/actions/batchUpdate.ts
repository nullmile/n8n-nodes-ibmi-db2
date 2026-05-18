import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

import { withWriteDatabase } from '../methods/database';
import { getRequiredString, prepareBatchParameters } from '../methods/sql';

export async function batchUpdate(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject[]> {
	const rawSql = getRequiredString(context, 'batchSql', itemIndex, 'Batch SQL');
	const { sql, parameterSets } = prepareBatchParameters(context, rawSql, itemIndex);

	return await withWriteDatabase(context, itemIndex, async (db) => {
		const affectedRows = await db.batchUpdate(sql, parameterSets);
		return affectedRows.map((count, index) => ({ index, affectedRows: count }));
	});
}
