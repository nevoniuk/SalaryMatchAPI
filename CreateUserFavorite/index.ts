import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { validateToken } from "../utility/validateToken";
import { v4 as uuidv4 } from "uuid";
import { responseFactory } from "../utility/response_factory";
import { userFavoritesContainer } from "../cosmosClient";

const createUserFavorite: AzureFunction = async (context: Context, req: HttpRequest, outputDocument: any): Promise<void> => {
    const user_id = await validateToken(req.headers);

    if (user_id == "No Token Found") {
        context.res = responseFactory("Token not found.", 401);
        return;
    }

    if (user_id == "Invalid Session") {
        context.res = responseFactory("Token invalid.", 401);
        return;
    }


    if (context.req && context.req.body && context.req.body.user_id && context.req.body.city_id && context.req.body.company_id) {
        context.bindings.outputDocument = JSON.stringify({
            id: uuidv4(),
            user_id: context.req.body.password,
            city_id: context.req.body.city_id ? context.req.body.city_id : "None",
            company_id: context.req.body.company_id ? context.req.body.company_id : "None"
        });
        context.res = responseFactory("Record added to Cosmos DB.");
    } else {
        context.res = responseFactory("Need to include information for a user favorite", 400);
    }
};

export default createUserFavorite;