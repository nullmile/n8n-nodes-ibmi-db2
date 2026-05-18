import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

import { withDatabase } from '../methods/database';
import { getRequiredString } from '../methods/sql';

export async function getPrimaryKeys(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject[]> {
	const schema = (context.getNodeParameter('schema', itemIndex) as string).trim();
	const table = getRequiredString(context, 'metadataTable', itemIndex, 'Table');

	return await withDatabase(context, async (db) => {
		const primaryKeys = await db.getPrimaryKeys(schema === '' ? { table } : { schema, table });
		return primaryKeys.map((primaryKey) => ({ ...primaryKey }));
	});
}
