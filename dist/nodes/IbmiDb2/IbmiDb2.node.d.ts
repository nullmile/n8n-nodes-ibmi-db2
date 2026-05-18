import type { IExecuteFunctions, INodeType, INodeTypeDescription, NodeOutput } from 'n8n-workflow';
import { ibmiDb2ConnectionTest } from './methods/credentialTest';
export declare class IbmiDb2 implements INodeType {
    description: INodeTypeDescription;
    methods: {
        credentialTest: {
            ibmiDb2ConnectionTest: typeof ibmiDb2ConnectionTest;
        };
    };
    execute(this: IExecuteFunctions): Promise<NodeOutput>;
}
