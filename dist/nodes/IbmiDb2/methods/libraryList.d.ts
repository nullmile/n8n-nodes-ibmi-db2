import type { ICredentialDataDecryptedObject } from 'n8n-workflow';
interface SessionConnection {
    execute(sql: string, params?: unknown[]): Promise<ClosableStatement>;
}
interface ClosableStatement {
    close(): void;
}
export declare function applyLibraryList(db: SessionConnection, credentials: ICredentialDataDecryptedObject): Promise<void>;
export {};
