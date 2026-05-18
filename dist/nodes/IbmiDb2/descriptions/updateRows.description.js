"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRowsFields = void 0;
const operations_1 = require("../operations");
exports.updateRowsFields = [
    {
        displayName: 'Update SQL',
        name: 'updateSql',
        type: 'string',
        typeOptions: {
            editor: 'sqlEditor',
            sqlDialect: 'StandardSQL',
            rows: 5,
        },
        default: '',
        required: true,
        placeholder: 'UPDATE MYLIB.CUSTOMERS SET STATUS = :status WHERE ID = :customerID',
        description: 'The UPDATE, DELETE, or other write statement to execute',
        hint: 'Prefer named placeholders like :status and :customerID for readability. Positional ? placeholders are still supported.',
        displayOptions: {
            show: {
                operation: [operations_1.OPERATIONS.UPDATE],
            },
        },
    },
    {
        displayName: 'Parameters',
        name: 'parameters',
        type: 'json',
        default: '[]',
        placeholder: '{"status": "active", "customerID": 101}',
        description: 'Optional SQL parameters as JSON',
        hint: 'Use named objects with :placeholders, or arrays for positional ? placeholders.',
        displayOptions: {
            show: {
                operation: [operations_1.OPERATIONS.UPDATE],
            },
        },
    },
];
//# sourceMappingURL=updateRows.description.js.map