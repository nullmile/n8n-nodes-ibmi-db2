import type { INodeProperties } from 'n8n-workflow';

import { OPERATIONS } from '../operations';

export const metadataFields: INodeProperties[] = [
	{
		displayName: 'Schema',
		name: 'schema',
		type: 'string',
		default: '',
		placeholder: 'MYLIB',
		description: 'Optional schema/library to inspect',
		hint: 'Leave empty to use the current library list.',
		displayOptions: {
			show: {
				operation: [
					OPERATIONS.GET_TABLES,
					OPERATIONS.GET_COLUMNS,
					OPERATIONS.GET_PRIMARY_KEYS,
				],
			},
		},
	},
	{
		displayName: 'Table',
		name: 'metadataTable',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'CUSTOMERS',
		description: 'Table name to inspect',
		displayOptions: {
			show: {
				operation: [OPERATIONS.GET_COLUMNS, OPERATIONS.GET_PRIMARY_KEYS],
			},
		},
	},
];
