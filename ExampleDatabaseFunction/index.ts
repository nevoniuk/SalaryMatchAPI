import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const exampleDatabaseFunction: AzureFunction = async (context: Context, req: HttpRequest, inputDocument: any): Promise<void> => {
    context.log('HTTP trigger function processed work item');
    if (!inputDocument) {
        context.log("Item not found");
    }
    else
    {
        context.log("Found item, address =" + inputDocument.address);
    }
};

export default exampleDatabaseFunction;