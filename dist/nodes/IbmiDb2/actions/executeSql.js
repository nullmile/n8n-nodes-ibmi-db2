"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeSql = executeSql;
const database_1 = require("../methods/database");
const sql_1 = require("../methods/sql");
async function executeSql(context, itemIndex) {
    const rawSql = (0, sql_1.getRequiredString)(context, 'sql', itemIndex, 'SQL');
    const { sql, parameters } = (0, sql_1.prepareSqlParameters)(context, rawSql, itemIndex);
    let statement;
    return await (0, database_1.withWriteDatabase)(context, itemIndex, async (db) => {
        const activeStatement = await db.execute(sql, parameters);
        statement = activeStatement;
        if (!activeStatement.isQuery()) {
            return [{ affectedRows: await activeStatement.updated() }];
        }
        return await (0, sql_1.collectRows)(activeStatement);
    }).finally(() => {
        statement === null || statement === void 0 ? void 0 : statement.close();
    });
}
//# sourceMappingURL=executeSql.js.map