import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { User } from "../types/database_types";


const updateUserPrefs: AzureFunction = async (context: Context, req: HttpRequest, outputDocument: any): Promise<void> => {
    if (context.req && context.req.body && context.req.body.id && context.req.body.email && context.req.body.degree 
        && context.req.body.gender && context.req.body.race && context.req.body.temperature_preference 
        && context.req.body.humidity_preference && context.req.body.sunlight_preference && context.req.body.demographic_preference
        && context.req.body.salary_preference && context.req.body.pto_preference && context.req.body.spender_type) {
            context.bindings.outputDocument = JSON.stringify({
                id: context.req.body.id,
                email: context.req.body.email,
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

export default updateUserPrefs;