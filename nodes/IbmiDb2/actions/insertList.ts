import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

import { withWriteDatabase } from '../methods/database';
import { getInsertRows, getRequiredString } from '../methods/sql';

export async function insertList(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject[]> {
	const tableName = getRequiredString(context, 'tableName', itemIndex, 'Table Name');
	const idColumn = getRequiredString(context, 'idColumn', itemIndex, 'ID Column');
	const rows = getInsertRows(context, itemIndex);

	return await withWriteDatabase(context, itemIndex, async (db) => {
		const ids = await db.insertList(tableName, idColumn, rows);
		return ids.map((id, index) => ({ index, insertId: id }));
	});
}
