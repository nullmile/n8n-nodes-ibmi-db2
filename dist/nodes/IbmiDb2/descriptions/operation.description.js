"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operationFields = void 0;
const operations_1 = require("../operations");
const batchUpdate_description_1 = require("./batchUpdate.description");
const executeSql_description_1 = require("./executeSql.description");
const insertAndGetId_description_1 = require("./insertAndGetId.description");
const insertList_description_1 = require("./insertList.description");
const metadata_description_1 = require("./metadata.description");
const selectRows_description_1 = require("./selectRows.description");
const transaction_description_1 = require("./transaction.description");
const updateRows_description_1 = require("./updateRows.description");
exports.operationFields = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
            {
                name: 'Batch Update',
                value: operations_1.OPERATIONS.BATCH_UPDATE,
                action: 'Run a batch update',
                description: 'Run one statement for multiple parameter sets',
            },
            {
                name: 'Execute SQL',
                value: operations_1.OPERATIONS.EXECUTE_SQL,
                action: 'Execute an SQL statement',
                description: 'Execute an SQL statement',
            },
            {
                name: 'Get Columns',
                value: operations_1.OPERATIONS.GET_COLUMNS,
                action: 'Get table columns',
                description: 'Get column metadata for a table',
            },
            {
                name: 'Get Primary Keys',
                value: operations_1.OPERATIONS.GET_PRIMARY_KEYS,
                action: 'Get table primary keys',
                description: 'Get primary-key metadata for a table',
            },
            {
                name: 'Get Tables',
                value: operations_1.OPERATIONS.GET_TABLES,
                action: 'Get tables',
                description: 'Get table metadata for a schema',
            },
            {
                name: 'Insert and Get ID',
                value: operations_1.OPERATIONS.INSERT_AND_GET_ID,
                action: 'Insert a row and get its ID',
                description: 'Insert a row and return the generated ID',
            },
            {
                name: 'Insert List',
                value: operations_1.OPERATIONS.INSERT_LIST,
                action: 'Insert multiple rows',
                description: 'Insert multiple rows and return generated IDs',
            },
            {
                name: 'Select',
                value: operations_1.OPERATIONS.SELECT,
                action: 'Select rows from a table',
                description: 'Run a SELECT statement and return rows',
            },
            {
                name: 'Update',
                value: operations_1.OPERATIONS.UPDATE,
                action: 'Run an update',
                description: 'Run an UPDATE, DELETE, or other write statement',
            },
        ],
        default: operations_1.OPERATIONS.SELECT,
        noDataExpression: true,
    },
    ...batchUpdate_description_1.batchUpdateFields,
    ...executeSql_description_1.executeSqlFields,
    ...insertAndGetId_description_1.insertAndGetIdFields,
    ...insertList_description_1.insertListFields,
    ...metadata_description_1.metadataFields,
    ...selectRows_description_1.selectRowsFields,
    ...transaction_description_1.transactionFields,
    ...updateRows_description_1.updateRowsFields,
];
//# sourceMappingURL=operation.description.js.map