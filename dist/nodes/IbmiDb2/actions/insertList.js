"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertList = insertList;
const database_1 = require("../methods/database");
const sql_1 = require("../methods/sql");
async function insertList(context, itemIndex) {
    const tableName = (0, sql_1.getRequiredString)(context, 'tableName', itemIndex, 'Table Name');
    const idColumn = (0, sql_1.getRequiredString)(context, 'idColumn', itemIndex, 'ID Column');
    const rows = (0, sql_1.getInsertRows)(context, itemIndex);
    return await (0, database_1.withWriteDatabase)(context, itemIndex, async (db) => {
        const ids = await db.insertList(tableName, idColumn, rows);
        return ids.map((id, index) => ({ index, insertId: id }));
    });
}
//# sourceMappingURL=insertList.js.map