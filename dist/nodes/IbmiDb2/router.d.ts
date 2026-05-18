import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { type Operation } from './operations';
export declare function routeOperation(context: IExecuteFunctions, operation: Operation, itemIndex: number): Promise<IDataObject[]>;
