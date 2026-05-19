import type { INodeProperties } from 'n8n-workflow';

import { OPERATIONS } from '../operations';
import { sqlParametersField } from './parameterFields.description';

export const selectRowsFields: INodeProperties[] = [
	{
		displayName: 'SELECT SQL',
		name: 'selectSql',
		type: 'string',
		typeOptions: {
			editor: 'sqlEditor',
			sqlDialect: 'StandardSQL',
			rows: 5,
		},
		default: '',
		required: true,
		placeholder: 'SELECT * FROM MYLIB.CUSTOMERS WHERE STATUS = :status',
		description: 'The SELECT statement to execute',
		hint: 'Prefer named placeholders like :status for readability. Positional ? placeholders are still supported.',
		displayOptions: {
			show: {
				operation: [OPERATIONS.SELECT],
			},
		},
	},
	{
		...sqlParametersField({
			show: {
				operation: [OPERATIONS.SELECT],
			},
		}),
	},
];
