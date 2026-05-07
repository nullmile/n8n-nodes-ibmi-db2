import { INodeProperties } from "n8n-workflow"

const properties: INodeProperties[] = [
    {
        name: 'SQL',
        default: '',
        displayName: 'SQL',
        type: 'string'
    }
]

export { properties }