import { EngineResponse, IExecuteFunctions, INodeType, INodeTypeDescription, NodeOutput } from "n8n-workflow";
export declare class IbmiDb2 implements INodeType {
    description: INodeTypeDescription;
    execute(this: IExecuteFunctions, response?: EngineResponse): Promise<NodeOutput>;
}
