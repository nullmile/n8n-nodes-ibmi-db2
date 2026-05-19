import type { INodeProperties } from 'n8n-workflow';

import { OPERATIONS } from '../operations';
import { sqlParametersField } from './parameterFields.description';

export const executeSqlFields: INodeProperties[] = [
	{
		displayName: 'SQL',
		name: 'sql',
		type: 'string',
		typeOptions: {
			editor: 'sqlEditor',
			sqlDialect: 'StandardSQL',
			rows: 5,
		},
		default: '',
		required: true,
		placeholder: 'SELECT * FROM MYLIB.CUSTOMERS WHERE ID = :customerID',
		description: 'The SQL statement to execute',
		hint: 'Prefer named placeholders like :customerID for readability. Positional ? placeholders are still supported.',
		displayOptions: {
			show: {
				operation: [OPERATIONS.EXECUTE_SQL],
			},
		},
	},
	{
		...sqlParametersField({
			show: {
				operation: [OPERATIONS.EXECUTE_SQL],
			},
		}),
	},
];
