export declare const OPERATIONS: {
    readonly BATCH_UPDATE: "batchUpdate";
    readonly EXECUTE_SQL: "executeSql";
    readonly GET_COLUMNS: "getColumns";
    readonly GET_PRIMARY_KEYS: "getPrimaryKeys";
    readonly GET_TABLES: "getTables";
    readonly INSERT_AND_GET_ID: "insertAndGetId";
    readonly INSERT_LIST: "insertList";
    readonly SELECT: "select";
    readonly UPDATE: "update";
    readonly UPSERT_FROM_INPUT: "upsertFromInput";
};
export type Operation = (typeof OPERATIONS)[keyof typeof OPERATIONS];
