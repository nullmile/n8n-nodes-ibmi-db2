import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

import { withDatabase } from '../methods/database';
import { collectStreamRows } from '../methods/sql';

export async function getTables(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject[]> {
	const schema = (context.getNodeParameter('schema', itemIndex) as string).trim();

	return await withDatabase(context, async (db) =>
		collectStreamRows(db.getTablesAsStream(schema === '' ? {} : { schema })),
	);
}
