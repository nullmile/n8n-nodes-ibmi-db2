"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColumns = getColumns;
const database_1 = require("../methods/database");
const sql_1 = require("../methods/sql");
async function getColumns(context, itemIndex) {
    const schema = context.getNodeParameter('schema', itemIndex).trim();
    const table = (0, sql_1.getRequiredString)(context, 'metadataTable', itemIndex, 'Table');
    return await (0, database_1.withDatabase)(context, async (db) => {
        const columns = await db.getColumns(schema === '' ? { table } : { schema, table });
        return columns.map((column) => ({ ...column }));
    });
}
//# sourceMappingURL=getColumns.js.map