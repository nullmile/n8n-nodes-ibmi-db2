import { INodeProperties } from "n8n-workflow"

import { properties as propertiesExecuteSql } from "./propertiesExecuteSql";

const properties: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
            {
                name: 'Execute SQL',
                value: 'executeSql',
                action: 'Execute an SQL',
                description: 'Execute an SQL'
            },
            {
                name: 'Select',
                value: 'select',
                action: 'Select rows from a table',
                description: 'Select rows from a table'
            }
        ],
        default: 'select',
        noDataExpression: true,
    },
    ...propertiesExecuteSql.map(p => {
        p.displayOptions = {
            ...p.displayOptions,
            show: {
                operation: ['executeSql']
            }
        };
        return p;
    })
]

export { properties }