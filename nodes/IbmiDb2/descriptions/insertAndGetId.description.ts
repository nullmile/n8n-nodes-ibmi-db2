import type { INodeProperties } from 'n8n-workflow';

import { OPERATIONS } from '../operations';

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
		displayName: 'Parameters',
		name: 'parameters',
		type: 'json',
		default: '[]',
		placeholder: '{"name": "Mario Rossi", "email": "mario@example.com"}',
		description: 'Optional SQL parameters as JSON',
		hint: 'Use named objects with :placeholders, or arrays for positional ? placeholders.',
		displayOptions: {
			show: {
				operation: [OPERATIONS.INSERT_AND_GET_ID],
			},
		},
	},
];
