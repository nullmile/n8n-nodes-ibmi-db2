import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { batchUpdate } from './actions/batchUpdate';
import { executeSql } from './actions/executeSql';
import { getColumns } from './actions/getColumns';
import { getPrimaryKeys } from './actions/getPrimaryKeys';
import { getTables } from './actions/getTables';
import { insertAndGetId } from './actions/insertAndGetId';
import { insertList } from './actions/insertList';
import { selectRows } from './actions/selectRows';
import { updateRows } from './actions/updateRows';
import { OPERATIONS, type Operation } from './operations';

export async function routeOperation(
	context: IExecuteFunctions,
	operation: Operation,
	itemIndex: number,
): Promise<IDataObject[]> {
	switch (operation) {
		case OPERATIONS.BATCH_UPDATE:
			return await batchUpdate(context, itemIndex);
		case OPERATIONS.EXECUTE_SQL:
			return await executeSql(context, itemIndex);
		case OPERATIONS.GET_COLUMNS:
			return await getColumns(context, itemIndex);
		case OPERATIONS.GET_PRIMARY_KEYS:
			return await getPrimaryKeys(context, itemIndex);
		case OPERATIONS.GET_TABLES:
			return await getTables(context, itemIndex);
		case OPERATIONS.INSERT_AND_GET_ID:
			return await insertAndGetId(context, itemIndex);
		case OPERATIONS.INSERT_LIST:
			return await insertList(context, itemIndex);
		case OPERATIONS.SELECT:
			return await selectRows(context, itemIndex);
		case OPERATIONS.UPDATE:
			return await updateRows(context, itemIndex);
		default:
			throw new NodeOperationError(context.getNode(), `Unsupported operation: ${String(operation)}`, {
				itemIndex,
			});
	}
}
