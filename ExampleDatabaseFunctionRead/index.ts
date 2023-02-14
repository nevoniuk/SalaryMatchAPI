import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const exampleDatabaseFunctionRead: AzureFunction = async (context: Context, req: HttpRequest, inputDocument: any): Promise<void> => {
    context.log('HTTP trigger function processed work item');
    if (!inputDocument) {
        context.res = {
            status: 404,
            body: "Item not found"
        }
    }
    else {
        context.res = {
            body: "Found item, address =" + inputDocument.address
        }
    }
};

export default exampleDatabaseFunctionRead;