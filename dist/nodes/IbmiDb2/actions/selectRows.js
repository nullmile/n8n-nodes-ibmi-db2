"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectRows = selectRows;
const n8n_workflow_1 = require("n8n-workflow");
const database_1 = require("../methods/database");
const sql_1 = require("../methods/sql");
async function selectRows(context, itemIndex) {
    const rawSql = (0, sql_1.getRequiredString)(context, 'selectSql', itemIndex, 'SELECT SQL');
    const { sql, parameters } = (0, sql_1.prepareSqlParameters)(context, rawSql, itemIndex);
    let statement;
    return await (0, database_1.withDatabase)(context, async (db) => {
        const activeStatement = await db.execute(sql, parameters);
        statement = activeStatement;
        if (!activeStatement.isQuery()) {
            throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Select must use a query statement.', {
                itemIndex,
            });
        }
        return await (0, sql_1.collectRows)(activeStatement);
    }).finally(() => {
        statement === null || statement === void 0 ? void 0 : statement.close();
    });
}
//# sourceMappingURL=selectRows.js.map