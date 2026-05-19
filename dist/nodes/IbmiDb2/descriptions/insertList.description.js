"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertListFields = void 0;
const operations_1 = require("../operations");
const parameterFields_description_1 = require("./parameterFields.description");
exports.insertListFields = [
    {
        displayName: 'Table Name',
        name: 'tableName',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'MYLIB.CUSTOMERS',
        description: 'The target table name',
        displayOptions: {
            show: {
                operation: [operations_1.OPERATIONS.INSERT_LIST],
            },
        },
    },
    {
        displayName: 'ID Column',
        name: 'idColumn',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'ID',
        description: 'The generated ID column returned by IBM i',
        hint: 'Use the exact column name defined on the table.',
        displayOptions: {
            show: {
                operation: [operations_1.OPERATIONS.INSERT_LIST],
            },
        },
    },
    {
        ...(0, parameterFields_description_1.insertRowsField)({
            show: {
                operation: [operations_1.OPERATIONS.INSERT_LIST],
            },
        }),
    },
];
//# sourceMappingURL=insertList.description.js.map