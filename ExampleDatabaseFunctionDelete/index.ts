import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { sampleContainer } from "../cosmosClient";

const exampleDatabaseFunctionDelete: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {

    try {
        await sampleContainer.item(context.bindingData.id, context.bindingData.id).delete();
        context.res = {
            body: "Item deleted"
        }
    } catch {
        context.res = {
            status: 404,
            body: "Item not found"
        }
    }

};

export default exampleDatabaseFunctionDelete;