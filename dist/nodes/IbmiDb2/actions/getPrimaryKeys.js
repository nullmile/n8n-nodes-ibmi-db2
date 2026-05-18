"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrimaryKeys = getPrimaryKeys;
const database_1 = require("../methods/database");
const sql_1 = require("../methods/sql");
async function getPrimaryKeys(context, itemIndex) {
    const schema = context.getNodeParameter('schema', itemIndex).trim();
    const table = (0, sql_1.getRequiredString)(context, 'metadataTable', itemIndex, 'Table');
    return await (0, database_1.withDatabase)(context, async (db) => {
        const primaryKeys = await db.getPrimaryKeys(schema === '' ? { table } : { schema, table });
        return primaryKeys.map((primaryKey) => ({ ...primaryKey }));
    });
}
//# sourceMappingURL=getPrimaryKeys.js.map