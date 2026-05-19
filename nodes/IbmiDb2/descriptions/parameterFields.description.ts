import type { IDisplayOptions, INodeProperties } from 'n8n-workflow';

const valueTypeOptions = [
	{
		name: 'String',
		value: 'string',
	},
	{
		name: 'Number',
		value: 'number',
	},
	{
		name: 'Null',
		value: 'null',
	},
	{
		name: 'Object or Array',
		value: 'json',
	},
];

const parameterValueFields: INodeProperties[] = [
	{
		displayName: 'Value Type',
		name: 'valueType',
		type: 'options',
		default: 'string',
		noDataExpression: true,
		options: valueTypeOptions,
	},
	{
		displayName: 'Value',
		name: 'valueString',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				valueType: ['string'],
			},
		},
	},
	{
		displayName: 'Value',
		name: 'valueNumber',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				valueType: ['number'],
			},
		},
	},
	{
		displayName: 'Value',
		name: 'valueJson',
		type: 'json',
		default: '{}',
		typeOptions: {
			rows: 2,
		},
		displayOptions: {
			show: {
				valueType: ['json'],
			},
		},
	},
];

export function sqlParametersField(displayOptions: IDisplayOptions): INodeProperties {
	return {
		displayName: 'Parameters',
		name: 'parametersUi',
		type: 'fixedCollection',
		default: {},
		placeholder: 'Add Parameter',
		description: 'Optional SQL parameters',
		hint: 'Use the placeholder name without ":" for named parameters. Leave Name empty for positional ? parameters.',
		displayOptions,
		typeOptions: {
			multipleValues: true,
			sortable: true,
			fixedCollection: {
				itemTitle: '={{ $collection.item.value.name || "Parameter" }}',
			},
		},
		options: [
			{
				displayName: 'Parameter',
				name: 'values',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						placeholder: 'customerID',
						description: 'Named placeholder without the leading colon. Leave empty for positional parameters.',
					},
					...parameterValueFields,
				],
			},
		],
	};
}

export function batchParameterSetsField(displayOptions: IDisplayOptions): INodeProperties {
	return {
		displayName: 'Parameter Sets',
		name: 'parameterSetsUi',
		type: 'fixedCollection',
		default: {},
		placeholder: 'Add Parameter',
		required: true,
		description: 'Parameter values to execute in batches',
		hint: 'Use Set Number to group values into each batch row. Use names for :placeholders, or leave Name empty for positional ? parameters.',
		displayOptions,
		typeOptions: {
			multipleValues: true,
			sortable: true,
			fixedCollection: {
				itemTitle:
					'={{ "Set " + ($collection.item.value.setNumber || 1) + ($collection.item.value.name ? ": " + $collection.item.value.name : "") }}',
			},
		},
		options: [
			{
				displayName: 'Parameter',
				name: 'values',
				values: [
					{
						displayName: 'Set Number',
						name: 'setNumber',
						type: 'number',
						default: 1,
						required: true,
						typeOptions: {
							minValue: 1,
							numberPrecision: 0,
						},
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						placeholder: 'customerID',
						description: 'Named placeholder without the leading colon. Leave empty for positional parameters.',
					},
					...parameterValueFields,
				],
			},
		],
	};
}

export function insertRowsField(displayOptions: IDisplayOptions): INodeProperties {
	return {
		displayName: 'Rows',
		name: 'rowsUi',
		type: 'fixedCollection',
		default: {},
		placeholder: 'Add Column Value',
		required: true,
		description: 'Column values to insert',
		hint: 'Use Row Number to group column values into inserted rows.',
		displayOptions,
		typeOptions: {
			multipleValues: true,
			sortable: true,
			fixedCollection: {
				itemTitle:
					'={{ "Row " + ($collection.item.value.rowNumber || 1) + ($collection.item.value.column ? ": " + $collection.item.value.column : "") }}',
			},
		},
		options: [
			{
				displayName: 'Column Value',
				name: 'values',
				values: [
					{
						displayName: 'Row Number',
						name: 'rowNumber',
						type: 'number',
						default: 1,
						required: true,
						typeOptions: {
							minValue: 1,
							numberPrecision: 0,
						},
					},
					{
						displayName: 'Column',
						name: 'column',
						type: 'string',
						default: '',
						required: true,
						placeholder: 'EMAIL',
					},
					...parameterValueFields,
				],
			},
		],
	};
}
