import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { database } from "../cosmosClient";
import { responseFactory } from "../utility/response_factory";

const logout: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {

    try {
        await database.container("LoginAttempts").item(context.req.body.id, context.req.body.id).delete();
        context.res = responseFactory("Token deleted");
    } catch {
        context.res = responseFactory("Token not found", 404);
    }

};

export default logout;