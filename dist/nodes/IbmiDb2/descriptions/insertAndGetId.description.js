"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertAndGetIdFields = void 0;
const operations_1 = require("../operations");
const parameterFields_description_1 = require("./parameterFields.description");
exports.insertAndGetIdFields = [
    {
        displayName: 'Insert SQL',
        name: 'insertSql',
        type: 'string',
        typeOptions: {
            editor: 'sqlEditor',
            sqlDialect: 'StandardSQL',
            rows: 5,
        },
        default: '',
        required: true,
        placeholder: 'INSERT INTO MYLIB.CUSTOMERS (NAME, EMAIL) VALUES (:name, :email)',
        description: 'The INSERT statement to execute',
        hint: 'Prefer named placeholders like :name and :email; the generated ID is returned as insertId.',
        displayOptions: {
            show: {
                operation: [operations_1.OPERATIONS.INSERT_AND_GET_ID],
            },
        },
    },
    {
        ...(0, parameterFields_description_1.sqlParametersField)({
            show: {
                operation: [operations_1.OPERATIONS.INSERT_AND_GET_ID],
            },
        }),
    },
];
//# sourceMappingURL=insertAndGetId.description.js.map