import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOutput,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import { operationFields } from './descriptions/operation.description';
import { ibmiDb2ConnectionTest } from './methods/credentialTest';
import { type Operation } from './operations';
import { routeOperation } from './router';

export class IbmiDb2 implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'DB2 for IBM i',
		name: 'ibmiDb2',
		icon: { light: 'file:../../icons/ibmDb2.svg', dark: 'file:../../icons/ibmDb2.dark.svg'},
		group: ['input'],
		version: 1,
		subtitle:
			'={{ ({ batchUpdate: "Batch Update", executeSql: "Execute SQL", getColumns: "Get Columns", getPrimaryKeys: "Get Primary Keys", getTables: "Get Tables", insertAndGetId: "Insert and Get ID", insertList: "Insert List", select: "Select", update: "Update" })[$parameter["operation"]] || $parameter["operation"] }}',
		description: 'Interact with DB2 for IBM i',
		defaults: {
			name: 'DB2 for IBM i',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'ibmiDb2Api',
				required: true,
				testedBy: 'ibmiDb2ConnectionTest',
			},
		],
		usableAsTool: true,
		properties: operationFields,
	};

	methods = {
		credentialTest: {
			ibmiDb2ConnectionTest,
		},
	};

	async execute(this: IExecuteFunctions): Promise<NodeOutput> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const operation = this.getNodeParameter('operation', itemIndex) as Operation;
				const results = await routeOperation(this, operation, itemIndex);

				returnData.push(...toExecutionData(results, itemIndex));
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: getErrorMessage(error) },
						pairedItem: { item: itemIndex },
					});
					continue;
				}

				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex });
			}
		}

		return [returnData];
	}
}

function toExecutionData(results: IDataObject[], itemIndex: number): INodeExecutionData[] {
	return results.map((json) => ({
		json,
		pairedItem: { item: itemIndex },
	}));
}

function getErrorMessage(error: unknown): string {
	return error instanceof Error ? error.message : 'Unknown error';
}
