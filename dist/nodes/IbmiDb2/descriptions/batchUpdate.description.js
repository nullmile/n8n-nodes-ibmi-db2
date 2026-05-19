"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchUpdateFields = void 0;
const operations_1 = require("../operations");
const parameterFields_description_1 = require("./parameterFields.description");
exports.batchUpdateFields = [
    {
        displayName: 'Batch SQL',
        name: 'batchSql',
        type: 'string',
        typeOptions: {
            editor: 'sqlEditor',
            sqlDialect: 'StandardSQL',
            rows: 5,
        },
        default: '',
        required: true,
        placeholder: 'UPDATE MYLIB.CUSTOMERS SET STATUS = :status WHERE ID = :customerID',
        description: 'The statement to execute once for each parameter set',
        hint: 'Prefer named placeholders like :status and :customerID for values that change from row to row.',
        displayOptions: {
            show: {
                operation: [operations_1.OPERATIONS.BATCH_UPDATE],
            },
        },
    },
    {
        ...(0, parameterFields_description_1.batchParameterSetsField)({
            show: {
                operation: [operations_1.OPERATIONS.BATCH_UPDATE],
            },
        }),
    },
];
//# sourceMappingURL=batchUpdate.description.js.map