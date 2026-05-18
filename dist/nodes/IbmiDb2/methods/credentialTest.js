"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ibmiDb2ConnectionTest = ibmiDb2ConnectionTest;
const node_jt400_1 = require("node-jt400");
const connectionConfig_1 = require("./connectionConfig");
const database_1 = require("./database");
async function ibmiDb2ConnectionTest(credential) {
    const credentialData = credential.data;
    const db = (0, node_jt400_1.pool)((0, connectionConfig_1.buildConnectionConfig)(credentialData));
    try {
        await (0, database_1.configureInquiryMessageReply)(db, credentialData);
        const result = await db.query(`
      SELECT 
        1 AS OK,
        CURRENT USER AS DB_USER,
        CURRENT SERVER AS DB_SERVER
      FROM SYSIBM.SYSDUMMY1
    `);
        return {
            status: 'OK',
            message: 'Connection established successfully: ' + result,
        };
    }
    catch (error) {
        return {
            status: 'Error',
            message: error,
        };
    }
    finally {
        await db.close();
    }
}
//# sourceMappingURL=credentialTest.js.map