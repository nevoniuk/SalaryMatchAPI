import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { validateToken
 } from "../utility/validateToken";
const updateUser: AzureFunction = async (context: Context, req: HttpRequest, outputDocument: any): Promise<void> => {
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

    if (context.req && context.req.body && context.req.body.id && context.req.body.password && context.req.body.degree
        && context.req.body.gender && context.req.body.race && context.req.body.temperature_preference 
        && context.req.body.humidity_preference && context.req.body.sunlight_preference && context.req.body.demographic_preference
        && context.req.body.salary_preference && context.req.body.pto_preference && context.req.body.spender_type) {
            context.bindings.outputDocument = JSON.stringify({
                id: user_id,
                password: context.req.body.password,
                degree: context.req.body.degree,
                gender: context.req.body.gender,
                race: context.req.body.race,
                temperature_preference: context.req.body.temperature_preference,
                humidity_preference: context.req.body.humidity_preference,
                sunlight_preference: context.req.body.sunlight_preference,
                demographic_preference: context.req.body.demographic_preference,
                salary_preference: context.req.body.salary_preference,
                pto_preference: context.req.body.pto_preference,
                spender_type: context.req.body.spender_type
            });
            context.res = {
                body: "Record added to Cosmos DB"
            }
    } else {
        context.res = {
            status: 400,
            body: "Need to include preferences for a user profile"
        }
    }
};

export default updateUser;