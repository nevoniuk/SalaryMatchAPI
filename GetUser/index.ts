import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { usersContainer } from "../cosmosClient";
import { User } from "../types/database_types";
import { responseFactory } from "../utility/response_factory";
import { userToUserInfo } from "../utility/type_mappings";
import { validateToken } from "../utility/validateToken";

const getUser: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
    const user_id = await validateToken(req.headers);

    if (user_id == "No Token Found") {
        context.res = responseFactory("Token not found.", 401);
        return;
    }

    if (user_id == "Invalid Session") {
        context.res = responseFactory("Token invalid.", 401);
        return;
    } 

    const user = await usersContainer.item(user_id, user_id).read<User>();
    context.res = responseFactory(userToUserInfo(user.resource));
};

export default getUser;