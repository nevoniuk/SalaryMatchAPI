import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { sampleContainer } from "../cosmosClient";
import { responseFactory } from "../utility/response_factory";

const exampleDatabaseFunctionDelete: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {

    try {
        await sampleContainer.item(context.bindingData.id, context.bindingData.id).delete();
        context.res = responseFactory("Item deleted");
    } catch {
        context.res = responseFactory("Item not found", 404);
    }

};

export default exampleDatabaseFunctionDelete;