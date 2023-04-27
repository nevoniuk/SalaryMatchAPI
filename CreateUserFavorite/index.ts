import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { validateToken } from "../utility/validateToken";
import { randomUUID } from "crypto";
import { responseFactory } from "../utility/response_factory";
import { userFavoritesContainer } from "../cosmosClient";
import { UserFavorites} from "../types/database_types"

const createUserFavorite: AzureFunction = async (context: Context, req: HttpRequest, outputDocument: any | null): Promise<void> => {
    const user_id = await validateToken(req.headers);

    if (user_id == "No Token Found") {
        context.res = responseFactory("Token not found.", 401);
        return;
    }

    if (user_id == "Invalid Session") {
        context.res = responseFactory("Token invalid.", 401);
        return;
    }
    if (outputDocument != null) {
        context.bindings.outputDocument = outputDocument;
        context.res = responseFactory("Record added to Cosmos DB.");
    }
    else if (context.req && context.req.body && (context.req.body.city_id || context.req.body.company_id)) {
        context.bindings.outputDocument = JSON.stringify({
            id: randomUUID(),
            user_id: user_id,
            city_id: context.req.body.city_id ? context.req.body.city_id : "None",
            company_id: context.req.body.company_id ? context.req.body.company_id : "None"
        });
        context.res = responseFactory("Record added to Cosmos DB.");
    } else {
        context.res = responseFactory("No Favorite Included", 400);
    }
};

export default createUserFavorite;