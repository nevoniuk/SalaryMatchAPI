import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { usersContainer } from "../cosmosClient";
import { responseFactory } from "../utility/response_factory";

const createUser: AzureFunction = async (context: Context, req: HttpRequest, outputDocument: any): Promise<void> => {
    if (context.req && context.req.body && context.req.body.id && context.req.body.password && context.req.body.temperature_preference 
        && context.req.body.humidity_preference && context.req.body.sunlight_preference && context.req.body.demographic_preference
        && context.req.body.salary_preference && context.req.body.pto_preference) {
            var accountExists = false;
            const item  = await usersContainer.item(context.req.body.id, context.req.body.id).read();

            if(item.statusCode == 200){
                accountExists = true;
            }
            
            if(!accountExists){
                context.bindings.outputDocument = JSON.stringify({
                    id: context.req.body.id,
                    password: context.req.body.password,
                    degree: context.req.body.degree ? context.req.body.degree : "None",
                    gender: context.req.body.gender ? context.req.body.gender : "Unknown",
                    race: context.req.body.race ? context.req.body.race : "Unknown",
                    temperature_preference: context.req.body.temperature_preference,
                    humidity_preference: context.req.body.humidity_preference,
                    sunlight_preference: context.req.body.sunlight_preference,
                    demographic_preference: context.req.body.demographic_preference,
                    salary_preference: context.req.body.salary_preference,
                    pto_preference: context.req.body.pto_preference,
                });
                context.res = responseFactory("User added to Cosmos DB");
            } else {
                context.res = responseFactory("Account Exists", 400);
            }
    } else {
        context.res = responseFactory("Need to include information for a user profile", 400);
    }
};

export default createUser;