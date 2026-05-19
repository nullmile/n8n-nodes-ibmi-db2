import type { INodeProperties } from 'n8n-workflow';

import { OPERATIONS } from '../operations';

const WRITE_OPERATIONS = [
	OPERATIONS.BATCH_UPDATE,
	OPERATIONS.EXECUTE_SQL,
	OPERATIONS.INSERT_AND_GET_ID,
	OPERATIONS.INSERT_LIST,
	OPERATIONS.UPDATE,
	OPERATIONS.UPSERT_FROM_INPUT,
];

export const transactionFields: INodeProperties[] = [
	{
		displayName: 'Transaction Mode',
		name: 'transactionMode',
		type: 'options',
		options: [
			{
				name: 'Disabled',
				value: 'none',
				description: 'Execute without an explicit transaction',
			},
			{
				name: 'Commit on Success',
				value: 'commit',
				description: 'Commit only if the operation completes successfully; roll back on failure',
			},
			{
				name: 'Always Roll Back (Test Run)',
				value: 'rollback',
				description: 'Execute the operation, then always roll it back',
			},
		],
		default: 'none',
		description: 'Control whether write operations are committed or rolled back',
		hint: 'Use Always Roll Back to test a write safely before allowing it to persist.',
		displayOptions: {
			show: {
				operation: WRITE_OPERATIONS,
			},
		},
	},
];
