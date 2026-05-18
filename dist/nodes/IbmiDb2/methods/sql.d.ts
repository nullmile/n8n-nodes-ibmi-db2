import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import type { Param, Statement } from 'node-jt400';
export declare function getRequiredString(context: IExecuteFunctions, name: string, itemIndex: number, label: string): string;
export declare function getSqlParameters(context: IExecuteFunctions, itemIndex: number, name?: string): Param[];
export declare function prepareSqlParameters(context: IExecuteFunctions, sql: string, itemIndex: number, name?: string): {
    sql: string;
    parameters: Param[];
};
export declare function getBatchParameters(context: IExecuteFunctions, itemIndex: number, name?: string): Param[][];
export declare function prepareBatchParameters(context: IExecuteFunctions, sql: string, itemIndex: number, name?: string): {
    sql: string;
    parameterSets: Param[][];
};
export declare function getInsertRows(context: IExecuteFunctions, itemIndex: number, name?: string): Record<string, Param>[];
export declare function collectRows(statement: Statement): Promise<IDataObject[]>;
export declare function collectStreamRows(stream: NodeJS.ReadableStream): Promise<IDataObject[]>;
