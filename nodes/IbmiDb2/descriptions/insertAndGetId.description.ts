import type { INodeProperties } from 'n8n-workflow';

import { OPERATIONS } from '../operations';
import { sqlParametersField } from './parameterFields.description';

export const insertAndGetIdFields: INodeProperties[] = [
	{
		displayName: 'Insert SQL',
		name: 'insertSql',
		type: 'string',
		typeOptions: {
			editor: 'sqlEditor',
			sqlDialect: 'StandardSQL',
			rows: 5,
		},
		default: '',
		required: true,
		placeholder: 'INSERT INTO MYLIB.CUSTOMERS (NAME, EMAIL) VALUES (:name, :email)',
		description: 'The INSERT statement to execute',
		hint: 'Prefer named placeholders like :name and :email; the generated ID is returned as insertId.',
		displayOptions: {
			show: {
				operation: [OPERATIONS.INSERT_AND_GET_ID],
			},
		},
	},
	{
		...sqlParametersField({
			show: {
				operation: [OPERATIONS.INSERT_AND_GET_ID],
			},
		}),
	},
];
