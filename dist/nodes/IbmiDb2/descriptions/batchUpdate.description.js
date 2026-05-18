"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchUpdateFields = void 0;
const operations_1 = require("../operations");
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
        displayName: 'Parameter Sets',
        name: 'parameterSets',
        type: 'json',
        default: '[]',
        required: true,
        placeholder: '[{"status":"active","customerID":101},{"status":"inactive","customerID":102}]',
        description: 'JSON array of parameter sets',
        hint: 'Use objects with named placeholders, or inner arrays with positional ? placeholders.',
        displayOptions: {
            show: {
                operation: [operations_1.OPERATIONS.BATCH_UPDATE],
            },
        },
    },
];
//# sourceMappingURL=batchUpdate.description.js.map