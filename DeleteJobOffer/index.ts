import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { database, jobOffersContainer } from "../cosmosClient";
import { validateToken } from "../utility/validateToken";

const deleteJobOffer: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
    const user_id = await validateToken(req.headers);

    if (user_id == "No Token Found") {
        context.res = {
            status: 401,
            body: "Token not found."
        }
        return;
    }

    if (user_id == "Invalid Session") {
        context.res = {
            status: 401,
            body: "Token invalid."
        }
        return;
    }

    const item = jobOffersContainer.item(context.req.body.id, context.req.body.id);
    const itemObj = await item.read();
    if(itemObj.resource.user_id == user_id){
        try {
            await item.delete();
            context.res = {
                body: "Item deleted"
            }
        } catch {
            context.res = {
                status: 404,
                body: "Item not found"
            }
        }
    } else {
        context.res = {
            status: 404,
            body: "Not your job offer"
        }
    }

};

export default deleteJobOffer;