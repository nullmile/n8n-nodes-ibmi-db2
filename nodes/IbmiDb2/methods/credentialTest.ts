import type {
	ICredentialDataDecryptedObject,
	ICredentialsDecrypted,
	ICredentialTestFunctions,
	INodeCredentialTestResult,
} from 'n8n-workflow';

import { pool } from 'node-jt400';

import { buildConnectionConfig } from './connectionConfig';
import { configureInquiryMessageReply } from './database';

export async function ibmiDb2ConnectionTest(
	this: ICredentialTestFunctions,
	credential: ICredentialsDecrypted,
): Promise<INodeCredentialTestResult> {
	const credentialData: ICredentialDataDecryptedObject = credential.data!;
	const db = pool(buildConnectionConfig(credentialData));

	try {
		await configureInquiryMessageReply(db, credentialData);
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
	} catch (error) {
		return {
			status: 'Error',
			message: error,
		};
	} finally {
		await db.close();
	}
}
