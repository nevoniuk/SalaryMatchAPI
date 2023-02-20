import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { database } from "../cosmosClient";

const deleteJobOffer: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {

    try {
        await database.container("JobOffers").item(context.req.body.id, context.req.body.id).delete();
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

export default deleteJobOffer;