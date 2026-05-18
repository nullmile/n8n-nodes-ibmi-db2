import type { ICredentialDataDecryptedObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { pool, type Connection, type TransactionConnection } from 'node-jt400';

import { buildConnectionConfig } from './connectionConfig';

export type TransactionMode = 'none' | 'commit' | 'rollback';
type InquiryMessageReply = '*DFT' | '*SYSRPYL' | '*RQD';

const DEFAULT_INQUIRY_MESSAGE_REPLY: InquiryMessageReply = '*DFT';

export async function withDatabase<T>(
	context: IExecuteFunctions,
	callback: (db: Connection, credentials: ICredentialDataDecryptedObject) => Promise<T>,
): Promise<T> {
	const credentials = (await context.getCredentials(
		'ibmiDb2Api',
	)) as ICredentialDataDecryptedObject;
	const db = pool(buildConnectionConfig(credentials));

	try {
		await configureInquiryMessageReply(db, credentials);
		return await callback(db, credentials);
	} finally {
		db.close();
	}
}

export async function withWriteDatabase<T>(
	context: IExecuteFunctions,
	itemIndex: number,
	callback: (
		db: TransactionConnection,
		credentials: ICredentialDataDecryptedObject,
	) => Promise<T>,
): Promise<T> {
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

function getTransactionMode(context: IExecuteFunctions, itemIndex: number): TransactionMode {
	const mode = context.getNodeParameter('transactionMode', itemIndex, 'none');

	if (mode === 'commit' || mode === 'rollback') {
		return mode;
	}

	return 'none';
}

async function runRollbackOnlyTransaction<T>(
	context: IExecuteFunctions,
	itemIndex: number,
	db: Connection,
	credentials: ICredentialDataDecryptedObject,
	callback: (
		transaction: TransactionConnection,
		credentials: ICredentialDataDecryptedObject,
	) => Promise<T>,
): Promise<T> {
	try {
		return await db.transaction(async (transaction) => {
			const result = await callback(transaction, credentials);
			throw new RollbackOnlyTransaction(result);
		});
	} catch (error) {
		if (error instanceof RollbackOnlyTransaction) {
			return error.result as T;
		}

		throw new NodeOperationError(context.getNode(), error as Error, { itemIndex });
	}
}

class RollbackOnlyTransaction extends Error {
	constructor(public readonly result: unknown) {
		super('Rollback-only transaction');
		this.name = 'RollbackOnlyTransaction';
	}
}

export async function configureInquiryMessageReply(
	db: Connection,
	credentials: ICredentialDataDecryptedObject,
): Promise<void> {
	const inquiryMessageReply = getInquiryMessageReply(credentials);

	if (inquiryMessageReply === undefined) {
		return;
	}

	const command = `CHGJOB INQMSGRPY(${inquiryMessageReply})`;
	await db.update('CALL QSYS2.QCMDEXC(?)', [command]);
}

function getInquiryMessageReply(
	credentials: ICredentialDataDecryptedObject,
): InquiryMessageReply | undefined {
	const value = credentials.inquiryMessageReply;

	if (value === '') {
		return undefined;
	}

	if (value === '*DFT' || value === '*SYSRPYL' || value === '*RQD') {
		return value;
	}

	return DEFAULT_INQUIRY_MESSAGE_REPLY;
}
