import type { INodeProperties } from 'n8n-workflow';

import { OPERATIONS } from '../operations';
import { sqlParametersField } from './parameterFields.description';

export const updateRowsFields: INodeProperties[] = [
	{
		displayName: 'Update SQL',
		name: 'updateSql',
		type: 'string',
		typeOptions: {
			editor: 'sqlEditor',
			sqlDialect: 'StandardSQL',
			rows: 5,
		},
		default: '',
		required: true,
		placeholder: 'UPDATE MYLIB.CUSTOMERS SET STATUS = :status WHERE ID = :customerID',
		description: 'The UPDATE, DELETE, or other write statement to execute',
		hint: 'Prefer named placeholders like :status and :customerID for readability. Positional ? placeholders are still supported.',
		displayOptions: {
			show: {
				operation: [OPERATIONS.UPDATE],
			},
		},
	},
	{
		...sqlParametersField({
			show: {
				operation: [OPERATIONS.UPDATE],
			},
		}),
	},
];
