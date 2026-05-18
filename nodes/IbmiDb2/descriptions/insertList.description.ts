import type { INodeProperties } from 'n8n-workflow';

import { OPERATIONS } from '../operations';

export const insertListFields: INodeProperties[] = [
	{
		displayName: 'Table Name',
		name: 'tableName',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'MYLIB.CUSTOMERS',
		description: 'The target table name',
		displayOptions: {
			show: {
				operation: [OPERATIONS.INSERT_LIST],
			},
		},
	},
	{
		displayName: 'ID Column',
		name: 'idColumn',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'ID',
		description: 'The generated ID column returned by IBM i',
		hint: 'Use the exact column name defined on the table.',
		displayOptions: {
			show: {
				operation: [OPERATIONS.INSERT_LIST],
			},
		},
	},
	{
		displayName: 'Rows',
		name: 'rows',
		type: 'json',
		default: '[]',
		required: true,
		placeholder: '[{"NAME":"Mario Rossi","EMAIL":"mario@example.com"}]',
		description: 'Rows to insert as a JSON array of objects',
		hint: 'Each object becomes one row; object keys are column names.',
		displayOptions: {
			show: {
				operation: [OPERATIONS.INSERT_LIST],
			},
		},
	},
];
