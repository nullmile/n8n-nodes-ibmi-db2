"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchUpdate = batchUpdate;
const database_1 = require("../methods/database");
const sql_1 = require("../methods/sql");
async function batchUpdate(context, itemIndex) {
    const rawSql = (0, sql_1.getRequiredString)(context, 'batchSql', itemIndex, 'Batch SQL');
    const { sql, parameterSets } = (0, sql_1.prepareBatchParameters)(context, rawSql, itemIndex);
    return await (0, database_1.withWriteDatabase)(context, itemIndex, async (db) => {
        const affectedRows = await db.batchUpdate(sql, parameterSets);
        return affectedRows.map((count, index) => ({ index, affectedRows: count }));
    });
}
//# sourceMappingURL=batchUpdate.js.map