import { SqlQuerySpec } from "@azure/cosmos";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { userFavoritesContainer } from "../cosmosClient";
import { UserFavorites } from "../types/database_types";
import { responseFactory } from "../utility/response_factory";

import { validateToken } from "../utility/validateToken";

const GetUserFavorites: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const user_id = await validateToken(req.headers);

    if (user_id == "No Token Found") {
        context.res = responseFactory("Token not found.", 401);
        return;
    }

    if (user_id == "Invalid Session") {
        context.res = responseFactory("Token invalid.", 401);
        return;
    }

    const userFavoritesQuery: SqlQuerySpec = {
        query: "SELECT * FROM c WHERE c.user_id = @user_id",
        parameters: [
          {
            name: "@user_id",
            value: user_id
          }
        ]
    };
    const { resources: userFavorites }: { resources: UserFavorites[] } = await userFavoritesContainer.items.query(userFavoritesQuery).fetchAll();
    context.res = responseFactory(userFavorites);

};

export default GetUserFavorites;