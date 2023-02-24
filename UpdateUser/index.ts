import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { usersContainer } from "../cosmosClient";
import { User } from "../types/database_types";
import { validateToken
 } from "../utility/validateToken";
const updateUser: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
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

    const userItemResponse = await usersContainer.item(user_id, user_id).read<User>();
    const oldUser = userItemResponse.resource;

    if (context.req && context.req.body) {
            context.bindings.outputDocument = JSON.stringify({
                id: user_id,
                password: oldUser.password,
                degree: context.req.body.degree ? context.req.body.degree : oldUser.degree,
                gender: context.req.body.gender ? context.req.body.gender : oldUser.gender,
                race: context.req.body.race ? context.req.body.race : oldUser.race,
                temperature_preference: context.req.body.temperature_preference ? context.req.body.temperature_preference : oldUser.temperature_preference,
                humidity_preference: context.req.body.humidity_preference ? context.req.body.humidity_preference : oldUser.humidity_preference,
                sunlight_preference: context.req.body.sunlight_preference ? context.req.body.sunlight_preference : oldUser.sunlight_preference,
                demographic_preference: context.req.body.demographic_preference ? context.req.body.demographic_preference : oldUser.demographic_preference,
                salary_preference: context.req.body.salary_preference ? context.req.body.salary_preference : oldUser.salary_preference,
                pto_preference: context.req.body.pto_preference ? context.req.body.pto_preference : oldUser.pto_preference,
                spender_type: context.req.body.spender_type ? context.req.body.spender_type : oldUser.spender_type
            });
            context.res = {
                body: "Record added to Cosmos DB"
            }
    } else {
        context.res = {
            status: 400,
            body: "Need to include preferences for a user profile in response body"
        }
    }
};

export default updateUser;