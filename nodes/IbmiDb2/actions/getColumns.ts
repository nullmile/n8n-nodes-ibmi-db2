import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

import { withDatabase } from '../methods/database';
import { getRequiredString } from '../methods/sql';

export async function getColumns(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject[]> {
	const schema = (context.getNodeParameter('schema', itemIndex) as string).trim();
	const table = getRequiredString(context, 'metadataTable', itemIndex, 'Table');

	return await withDatabase(context, async (db) => {
		const columns = await db.getColumns(schema === '' ? { table } : { schema, table });
		return columns.map((column) => ({ ...column }));
	});
}
