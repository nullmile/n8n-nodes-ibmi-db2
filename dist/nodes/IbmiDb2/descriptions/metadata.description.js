"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadataFields = void 0;
const operations_1 = require("../operations");
exports.metadataFields = [
    {
        displayName: 'Schema',
        name: 'schema',
        type: 'string',
        default: '',
        placeholder: 'MYLIB',
        description: 'Optional schema/library to inspect',
        hint: 'Leave empty to use the current library list.',
        displayOptions: {
            show: {
                operation: [
                    operations_1.OPERATIONS.GET_TABLES,
                    operations_1.OPERATIONS.GET_COLUMNS,
                    operations_1.OPERATIONS.GET_PRIMARY_KEYS,
                ],
            },
        },
    },
    {
        displayName: 'Table',
        name: 'metadataTable',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'CUSTOMERS',
        description: 'Table name to inspect',
        displayOptions: {
            show: {
                operation: [operations_1.OPERATIONS.GET_COLUMNS, operations_1.OPERATIONS.GET_PRIMARY_KEYS],
            },
        },
    },
];
//# sourceMappingURL=metadata.description.js.map