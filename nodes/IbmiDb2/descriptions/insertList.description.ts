import type { INodeProperties } from 'n8n-workflow';

import { OPERATIONS } from '../operations';
import { insertRowsField } from './parameterFields.description';

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
		...insertRowsField({
			show: {
				operation: [OPERATIONS.INSERT_LIST],
			},
		}),
	},
];
