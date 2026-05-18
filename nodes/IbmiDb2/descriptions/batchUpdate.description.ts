import type { INodeProperties } from 'n8n-workflow';

import { OPERATIONS } from '../operations';

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
		displayName: 'Parameter Sets',
		name: 'parameterSets',
		type: 'json',
		default: '[]',
		required: true,
		placeholder: '[{"status":"active","customerID":101},{"status":"inactive","customerID":102}]',
		description: 'JSON array of parameter sets',
		hint: 'Use objects with named placeholders, or inner arrays with positional ? placeholders.',
		displayOptions: {
			show: {
				operation: [OPERATIONS.BATCH_UPDATE],
			},
		},
	},
];
