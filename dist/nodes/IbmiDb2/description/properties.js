"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.properties = void 0;
const propertiesExecuteSql_1 = require("./propertiesExecuteSql");
const properties = [
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
    ...propertiesExecuteSql_1.properties.map(p => {
        p.displayOptions = {
            ...p.displayOptions,
            show: {
                operation: ['executeSql']
            }
        };
        return p;
    })
];
exports.properties = properties;
//# sourceMappingURL=properties.js.map