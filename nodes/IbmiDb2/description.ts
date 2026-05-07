import { INodeTypeDescription, NodeConnectionTypes } from "n8n-workflow";
import { properties } from './description/properties'

const description: INodeTypeDescription = {
    displayName: 'DB2 for IBM i',
    name: 'ibmiDb2',
    icon: 'file:../../icons/ibmDb2.svg',
    group: ['input'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Interact with DB2 for IBM i',
    defaults: {
        name: 'DB2 for IBM i'
    },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [
        {
            name: 'ibmiDb2Api',
            required: true
        }
    ],
    usableAsTool: true,
    properties
};

export { description };