"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IbmiDb2 = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const operation_description_1 = require("./descriptions/operation.description");
const credentialTest_1 = require("./methods/credentialTest");
const router_1 = require("./router");
class IbmiDb2 {
    constructor() {
        this.description = {
            displayName: 'DB2 for IBM i',
            name: 'ibmiDb2',
            icon: { light: 'file:../../icons/ibmDb2.svg', dark: 'file:../../icons/ibmDb2.dark.svg' },
            group: ['input'],
            version: 1,
            subtitle: '={{ ({ batchUpdate: "Batch Update", executeSql: "Execute SQL", getColumns: "Get Columns", getPrimaryKeys: "Get Primary Keys", getTables: "Get Tables", insertAndGetId: "Insert and Get ID", insertList: "Insert List", select: "Select", update: "Update", upsertFromInput: "Upsert From Input" })[$parameter["operation"]] || $parameter["operation"] }}',
            description: 'Interact with DB2 for IBM i',
            defaults: {
                name: 'DB2 for IBM i',
            },
            inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            credentials: [
                {
                    name: 'ibmiDb2Api',
                    required: true,
                    testedBy: 'ibmiDb2ConnectionTest',
                },
            ],
            usableAsTool: true,
            properties: operation_description_1.operationFields,
        };
        this.methods = {
            credentialTest: {
                ibmiDb2ConnectionTest: credentialTest_1.ibmiDb2ConnectionTest,
            },
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            try {
                const operation = this.getNodeParameter('operation', itemIndex);
                const results = await (0, router_1.routeOperation)(this, operation, itemIndex);
                appendExecutionData(returnData, results, itemIndex);
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: { error: getErrorMessage(error) },
                        pairedItem: { item: itemIndex },
                    });
                    continue;
                }
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, { itemIndex });
            }
        }
        return [returnData];
    }
}
exports.IbmiDb2 = IbmiDb2;
function appendExecutionData(returnData, results, itemIndex) {
    for (const json of results) {
        returnData.push({
            json,
            pairedItem: { item: itemIndex },
        });
    }
}
function getErrorMessage(error) {
    return error instanceof Error ? error.message : 'Unknown error';
}
//# sourceMappingURL=IbmiDb2.node.js.map