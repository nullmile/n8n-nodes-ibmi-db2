export const OPERATIONS = {
	BATCH_UPDATE: 'batchUpdate',
	EXECUTE_SQL: 'executeSql',
	GET_COLUMNS: 'getColumns',
	GET_PRIMARY_KEYS: 'getPrimaryKeys',
	GET_TABLES: 'getTables',
	INSERT_AND_GET_ID: 'insertAndGetId',
	INSERT_LIST: 'insertList',
	SELECT: 'select',
	UPDATE: 'update',
	UPSERT_FROM_INPUT: 'upsertFromInput',
} as const;

export type Operation = (typeof OPERATIONS)[keyof typeof OPERATIONS];
