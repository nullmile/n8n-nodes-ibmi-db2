"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertFromInputFields = void 0;
const operations_1 = require("../operations");
exports.upsertFromInputFields = [
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
                operation: [operations_1.OPERATIONS.UPSERT_FROM_INPUT],
            },
        },
    },
    {
        displayName: 'Match Columns',
        name: 'matchColumns',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'CUSTOMER_ID, EMAIL',
        description: 'Comma-separated input columns used to find existing rows before inserting',
        hint: 'These columns must exist in each input item. All other input columns are updated when a match is found.',
        displayOptions: {
            show: {
                operation: [operations_1.OPERATIONS.UPSERT_FROM_INPUT],
            },
        },
    },
    {
        displayName: 'Columns to Exclude',
        name: 'excludeColumns',
        type: 'string',
        default: '',
        placeholder: 'createdAt, sourceSystem',
        description: 'Comma-separated input columns to ignore when building the insert or update row',
        displayOptions: {
            show: {
                operation: [operations_1.OPERATIONS.UPSERT_FROM_INPUT],
            },
        },
    },
    {
        displayName: 'Return Previous Rows',
        name: 'returnPreviousRows',
        type: 'boolean',
        default: false,
        description: 'Whether to include the rows found before the update in the output',
        displayOptions: {
            show: {
                operation: [operations_1.OPERATIONS.UPSERT_FROM_INPUT],
            },
        },
    },
    {
        displayName: 'Allow Multiple Matches',
        name: 'allowMultipleMatches',
        type: 'boolean',
        default: false,
        description: 'Whether to update all rows that match the Match Columns instead of failing',
        hint: 'Keep this disabled when Match Columns are meant to identify one row.',
        displayOptions: {
            show: {
                operation: [operations_1.OPERATIONS.UPSERT_FROM_INPUT],
            },
        },
    },
];
//# sourceMappingURL=upsertFromInput.description.js.map