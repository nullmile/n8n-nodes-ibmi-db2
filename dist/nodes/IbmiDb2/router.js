"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeOperation = routeOperation;
const n8n_workflow_1 = require("n8n-workflow");
const batchUpdate_1 = require("./actions/batchUpdate");
const executeSql_1 = require("./actions/executeSql");
const getColumns_1 = require("./actions/getColumns");
const getPrimaryKeys_1 = require("./actions/getPrimaryKeys");
const getTables_1 = require("./actions/getTables");
const insertAndGetId_1 = require("./actions/insertAndGetId");
const insertList_1 = require("./actions/insertList");
const selectRows_1 = require("./actions/selectRows");
const updateRows_1 = require("./actions/updateRows");
const operations_1 = require("./operations");
async function routeOperation(context, operation, itemIndex) {
    switch (operation) {
        case operations_1.OPERATIONS.BATCH_UPDATE:
            return await (0, batchUpdate_1.batchUpdate)(context, itemIndex);
        case operations_1.OPERATIONS.EXECUTE_SQL:
            return await (0, executeSql_1.executeSql)(context, itemIndex);
        case operations_1.OPERATIONS.GET_COLUMNS:
            return await (0, getColumns_1.getColumns)(context, itemIndex);
        case operations_1.OPERATIONS.GET_PRIMARY_KEYS:
            return await (0, getPrimaryKeys_1.getPrimaryKeys)(context, itemIndex);
        case operations_1.OPERATIONS.GET_TABLES:
            return await (0, getTables_1.getTables)(context, itemIndex);
        case operations_1.OPERATIONS.INSERT_AND_GET_ID:
            return await (0, insertAndGetId_1.insertAndGetId)(context, itemIndex);
        case operations_1.OPERATIONS.INSERT_LIST:
            return await (0, insertList_1.insertList)(context, itemIndex);
        case operations_1.OPERATIONS.SELECT:
            return await (0, selectRows_1.selectRows)(context, itemIndex);
        case operations_1.OPERATIONS.UPDATE:
            return await (0, updateRows_1.updateRows)(context, itemIndex);
        default:
            throw new n8n_workflow_1.NodeOperationError(context.getNode(), `Unsupported operation: ${String(operation)}`, {
                itemIndex,
            });
    }
}
//# sourceMappingURL=router.js.map