import type { INodeProperties } from 'n8n-workflow';

import { OPERATIONS } from '../operations';
import { batchUpdateFields } from './batchUpdate.description';
import { executeSqlFields } from './executeSql.description';
import { insertAndGetIdFields } from './insertAndGetId.description';
import { insertListFields } from './insertList.description';
import { metadataFields } from './metadata.description';
import { selectRowsFields } from './selectRows.description';
import { transactionFields } from './transaction.description';
import { updateRowsFields } from './updateRows.description';

export const operationFields: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		options: [
			{
				name: 'Batch Update',
				value: OPERATIONS.BATCH_UPDATE,
				action: 'Run a batch update',
				description: 'Run one statement for multiple parameter sets',
			},
			{
				name: 'Execute SQL',
				value: OPERATIONS.EXECUTE_SQL,
				action: 'Execute an SQL statement',
				description: 'Execute an SQL statement',
			},
			{
				name: 'Get Columns',
				value: OPERATIONS.GET_COLUMNS,
				action: 'Get table columns',
				description: 'Get column metadata for a table',
			},
			{
				name: 'Get Primary Keys',
				value: OPERATIONS.GET_PRIMARY_KEYS,
				action: 'Get table primary keys',
				description: 'Get primary-key metadata for a table',
			},
			{
				name: 'Get Tables',
				value: OPERATIONS.GET_TABLES,
				action: 'Get tables',
				description: 'Get table metadata for a schema',
			},
			{
				name: 'Insert and Get ID',
				value: OPERATIONS.INSERT_AND_GET_ID,
				action: 'Insert a row and get its ID',
				description: 'Insert a row and return the generated ID',
			},
			{
				name: 'Insert List',
				value: OPERATIONS.INSERT_LIST,
				action: 'Insert multiple rows',
				description: 'Insert multiple rows and return generated IDs',
			},
			{
				name: 'Select',
				value: OPERATIONS.SELECT,
				action: 'Select rows from a table',
				description: 'Run a SELECT statement and return rows',
			},
			{
				name: 'Update',
				value: OPERATIONS.UPDATE,
				action: 'Run an update',
				description: 'Run an UPDATE, DELETE, or other write statement',
			},
		],
		default: OPERATIONS.SELECT,
		noDataExpression: true,
	},
	...batchUpdateFields,
	...executeSqlFields,
	...insertAndGetIdFields,
	...insertListFields,
	...metadataFields,
	...selectRowsFields,
	...transactionFields,
	...updateRowsFields,
];
