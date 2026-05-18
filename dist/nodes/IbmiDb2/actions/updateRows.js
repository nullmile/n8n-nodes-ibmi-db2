"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRows = updateRows;
const database_1 = require("../methods/database");
const sql_1 = require("../methods/sql");
async function updateRows(context, itemIndex) {
    const rawSql = (0, sql_1.getRequiredString)(context, 'updateSql', itemIndex, 'Update SQL');
    const { sql, parameters } = (0, sql_1.prepareSqlParameters)(context, rawSql, itemIndex);
    return await (0, database_1.withWriteDatabase)(context, itemIndex, async (db) => [
        { affectedRows: await db.update(sql, parameters) },
    ]);
}
//# sourceMappingURL=updateRows.js.map