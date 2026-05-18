"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withDatabase = withDatabase;
exports.withWriteDatabase = withWriteDatabase;
exports.configureInquiryMessageReply = configureInquiryMessageReply;
const n8n_workflow_1 = require("n8n-workflow");
const node_jt400_1 = require("node-jt400");
const connectionConfig_1 = require("./connectionConfig");
const DEFAULT_INQUIRY_MESSAGE_REPLY = '*DFT';
async function withDatabase(context, callback) {
    const credentials = (await context.getCredentials('ibmiDb2Api'));
    const db = (0, node_jt400_1.pool)((0, connectionConfig_1.buildConnectionConfig)(credentials));
    try {
        await configureInquiryMessageReply(db, credentials);
        return await callback(db, credentials);
    }
    finally {
        db.close();
    }
}
async function withWriteDatabase(context, itemIndex, callback) {
    return await withDatabase(context, async (db, credentials) => {
        const transactionMode = getTransactionMode(context, itemIndex);
        if (transactionMode === 'none') {
            return await callback(db, credentials);
        }
        if (transactionMode === 'commit') {
            return await db.transaction(async (transaction) => await callback(transaction, credentials));
        }
        return await runRollbackOnlyTransaction(context, itemIndex, db, credentials, callback);
    });
}
function getTransactionMode(context, itemIndex) {
    const mode = context.getNodeParameter('transactionMode', itemIndex, 'none');
    if (mode === 'commit' || mode === 'rollback') {
        return mode;
    }
    return 'none';
}
async function runRollbackOnlyTransaction(context, itemIndex, db, credentials, callback) {
    try {
        return await db.transaction(async (transaction) => {
            const result = await callback(transaction, credentials);
            throw new RollbackOnlyTransaction(result);
        });
    }
    catch (error) {
        if (error instanceof RollbackOnlyTransaction) {
            return error.result;
        }
        throw new n8n_workflow_1.NodeOperationError(context.getNode(), error, { itemIndex });
    }
}
class RollbackOnlyTransaction extends Error {
    constructor(result) {
        super('Rollback-only transaction');
        this.result = result;
        this.name = 'RollbackOnlyTransaction';
    }
}
async function configureInquiryMessageReply(db, credentials) {
    const inquiryMessageReply = getInquiryMessageReply(credentials);
    if (inquiryMessageReply === undefined) {
        return;
    }
    const command = `CHGJOB INQMSGRPY(${inquiryMessageReply})`;
    await db.update('CALL QSYS2.QCMDEXC(?)', [command]);
}
function getInquiryMessageReply(credentials) {
    const value = credentials.inquiryMessageReply;
    if (value === '') {
        return undefined;
    }
    if (value === '*DFT' || value === '*SYSRPYL' || value === '*RQD') {
        return value;
    }
    return DEFAULT_INQUIRY_MESSAGE_REPLY;
}
//# sourceMappingURL=database.js.map