"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionFields = void 0;
const operations_1 = require("../operations");
const WRITE_OPERATIONS = [
    operations_1.OPERATIONS.BATCH_UPDATE,
    operations_1.OPERATIONS.EXECUTE_SQL,
    operations_1.OPERATIONS.INSERT_AND_GET_ID,
    operations_1.OPERATIONS.INSERT_LIST,
    operations_1.OPERATIONS.UPDATE,
];
exports.transactionFields = [
    {
        displayName: 'Transaction Mode',
        name: 'transactionMode',
        type: 'options',
        options: [
            {
                name: 'Disabled',
                value: 'none',
                description: 'Execute without an explicit transaction',
            },
            {
                name: 'Commit on Success',
                value: 'commit',
                description: 'Commit only if the operation completes successfully; roll back on failure',
            },
            {
                name: 'Always Roll Back (Test Run)',
                value: 'rollback',
                description: 'Execute the operation, then always roll it back',
            },
        ],
        default: 'none',
        description: 'Control whether write operations are committed or rolled back',
        hint: 'Use Always Roll Back to test a write safely before allowing it to persist.',
        displayOptions: {
            show: {
                operation: WRITE_OPERATIONS,
            },
        },
    },
];
//# sourceMappingURL=transaction.description.js.map