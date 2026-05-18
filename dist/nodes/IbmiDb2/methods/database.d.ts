import type { ICredentialDataDecryptedObject, IExecuteFunctions } from 'n8n-workflow';
import { type Connection, type TransactionConnection } from 'node-jt400';
export type TransactionMode = 'none' | 'commit' | 'rollback';
export declare function withDatabase<T>(context: IExecuteFunctions, callback: (db: Connection, credentials: ICredentialDataDecryptedObject) => Promise<T>): Promise<T>;
export declare function withWriteDatabase<T>(context: IExecuteFunctions, itemIndex: number, callback: (db: TransactionConnection, credentials: ICredentialDataDecryptedObject) => Promise<T>): Promise<T>;
export declare function configureInquiryMessageReply(db: Connection, credentials: ICredentialDataDecryptedObject): Promise<void>;
