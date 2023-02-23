import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { database } from "../cosmosClient";

const logout: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {

    try {
        await database.container("LoginAttempts").item(context.req.body.id, context.req.body.id).delete();
        context.res = {
            body: "Token deleted"
        }
    } catch {
        context.res = {
            status: 404,
            body: "Token not found"
        }
    }

};

export default logout;