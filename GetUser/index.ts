import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { usersContainer } from "../cosmosClient";
import { User } from "../types/database_types";
import { userToUserInfo } from "../utility/type_mappings";
import { validateToken } from "../utility/validateToken";

const getUser: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
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

    const user = await usersContainer.item(user_id, user_id).read<User>();

    context.res = {
        body: userToUserInfo(user.resource)
    }
};

export default getUser;