"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTables = getTables;
const database_1 = require("../methods/database");
const sql_1 = require("../methods/sql");
async function getTables(context, itemIndex) {
    const schema = context.getNodeParameter('schema', itemIndex).trim();
    return await (0, database_1.withDatabase)(context, async (db) => (0, sql_1.collectStreamRows)(db.getTablesAsStream(schema === '' ? {} : { schema })));
}
//# sourceMappingURL=getTables.js.map