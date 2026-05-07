"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const description = {
    displayName: 'DB2 for IBM i',
    name: 'ibmiDb2',
    icon: 'file:../../icons/ibmDb2.svg',
    group: ['input'],
    version: 1,
    description: 'Interact with DB2 for IBM i',
    defaults: {
        name: 'DB2 for IBM i'
    },
    inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    credentials: [
        {
            name: 'ibmiDb2Api',
            required: true
        }
    ],
    usableAsTool: true,
    properties: []
};
exports.description = description;
//# sourceMappingURL=description.js.map