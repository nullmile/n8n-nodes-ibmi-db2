// node-jt400@6.0.1 ships CommonJS declarations as `index.d.cts`, but its
// package exports point TypeScript at a non-existent `index.d.ts` file.
declare module 'node-jt400' {
	export interface CLOB {
		type: 'CLOB';
		value: string;
	}

	export interface BLOB {
		type: 'BLOB';
		value: string;
	}

	export type Param = string | number | Date | null | CLOB | BLOB;

	export interface Metadata {
		name: string;
		typeName: string;
		precision: number;
		scale: number;
	}

	export interface Statement {
		isQuery(): boolean;
		metadata(): Promise<Metadata[]>;
		asArray(): Promise<string[][]>;
		asObjectStream(
			options?: { bufferSize?: number },
		): Promise<AsyncIterable<Record<string, import('n8n-workflow').GenericValue>>>;
		updated(): Promise<number>;
		close(): void;
	}

	export interface TransactionConnection {
		execute(sql: string, params?: Param[]): Promise<Statement>;
		query<T>(sql: string, params?: Param[]): Promise<T[]>;
		update(sql: string, params?: Param[]): Promise<number>;
		insertAndGetId(sql: string, params?: Param[]): Promise<number>;
		insertList(tableName: string, idColumn: string, rows: Record<string, Param>[]): Promise<number[]>;
		batchUpdate(sql: string, params?: Param[][]): Promise<number[]>;
	}

	export interface Connection extends TransactionConnection {
		getTablesAsStream(
			params: { schema?: string },
		): NodeJS.ReadableStream;
		getColumns(params: { schema?: string; table: string }): Promise<Metadata[]>;
		getPrimaryKeys(params: { schema?: string; table: string }): Promise<Metadata[]>;
		transaction<T>(callback: (transaction: TransactionConnection) => Promise<T>): Promise<T>;
		close(): void;
	}

	export function pool(config?: Record<string, unknown>): Connection;
}
