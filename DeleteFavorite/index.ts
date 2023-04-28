import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { database, userFavoritesContainer } from "../cosmosClient";
import { responseFactory } from "../utility/response_factory";
import { validateToken } from "../utility/validateToken";

const DeleteFavorite: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
    const user_id = await validateToken(req.headers);

    if (user_id == "No Token Found") {
        context.res = responseFactory("Token not found.", 401);
        return;
    }

    if (user_id == "Invalid Session") {
        context.res = responseFactory("Token invalid.", 401);
        return;
    }

    const item = userFavoritesContainer.item(context.req.body.id, context.req.body.id);
    const itemObj = await item.read();
    if(itemObj.resource.user_id == user_id){
        try {
            await item.delete();
            context.res = responseFactory("Item deleted.");
        } catch {
            context.res = responseFactory("Item not found.", 404);
        }
    } else {
        context.res = responseFactory("Not your user favorite.", 404);
    }

};

export default DeleteFavorite;