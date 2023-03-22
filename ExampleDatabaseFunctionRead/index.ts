import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { responseFactory } from "../utility/response_factory";

const exampleDatabaseFunctionRead: AzureFunction = async (context: Context, req: HttpRequest, inputDocument: any): Promise<void> => {
    context.log('HTTP trigger function processed work item');
    if (!inputDocument) {
        context.res = {
            status: 404,
            body: "Item not found"
        }
        context.res = responseFactory("Item not found", 404);
    }
    else {
        context.res = responseFactory(`Found item, address = + ${inputDocument.address}`);
    }
};

export default exampleDatabaseFunctionRead;