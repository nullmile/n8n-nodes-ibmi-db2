"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRowsFields = void 0;
const operations_1 = require("../operations");
const parameterFields_description_1 = require("./parameterFields.description");
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
        ...(0, parameterFields_description_1.sqlParametersField)({
            show: {
                operation: [operations_1.OPERATIONS.UPDATE],
            },
        }),
    },
];
//# sourceMappingURL=updateRows.description.js.map