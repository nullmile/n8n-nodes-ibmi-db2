import { EngineResponse, IExecuteFunctions, INodeType, INodeTypeDescription, NodeOutput } from "n8n-workflow";
import { description } from "./description";
import { router } from "./router";

export class IbmiDb2 implements INodeType {
    description: INodeTypeDescription = description;

    async execute(this: IExecuteFunctions, response?: EngineResponse): Promise<NodeOutput> {
        return await router(this, response)
    };
}