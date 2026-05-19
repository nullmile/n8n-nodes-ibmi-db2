import type { INodeProperties } from 'n8n-workflow';

import { OPERATIONS } from '../operations';
import { batchParameterSetsField } from './parameterFields.description';

export const batchUpdateFields: INodeProperties[] = [
	{
		displayName: 'Batch SQL',
		name: 'batchSql',
		type: 'string',
		typeOptions: {
			editor: 'sqlEditor',
			sqlDialect: 'StandardSQL',
			rows: 5,
		},
		default: '',
		required: true,
		placeholder: 'UPDATE MYLIB.CUSTOMERS SET STATUS = :status WHERE ID = :customerID',
		description: 'The statement to execute once for each parameter set',
		hint: 'Prefer named placeholders like :status and :customerID for values that change from row to row.',
		displayOptions: {
			show: {
				operation: [OPERATIONS.BATCH_UPDATE],
			},
		},
	},
	{
		...batchParameterSetsField({
			show: {
				operation: [OPERATIONS.BATCH_UPDATE],
			},
		}),
	},
];
