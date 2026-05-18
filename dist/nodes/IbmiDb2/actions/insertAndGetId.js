"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertAndGetId = insertAndGetId;
const database_1 = require("../methods/database");
const sql_1 = require("../methods/sql");
async function insertAndGetId(context, itemIndex) {
    const rawSql = (0, sql_1.getRequiredString)(context, 'insertSql', itemIndex, 'Insert SQL');
    const { sql, parameters } = (0, sql_1.prepareSqlParameters)(context, rawSql, itemIndex);
    return await (0, database_1.withWriteDatabase)(context, itemIndex, async (db) => [
        { insertId: await db.insertAndGetId(sql, parameters) },
    ]);
}
//# sourceMappingURL=insertAndGetId.js.map