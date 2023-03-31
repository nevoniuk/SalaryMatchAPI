import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { JobOffer } from "../types/database_types";
import { validateToken } from "../utility/validateToken";
import { v4 as uuidv4 } from "uuid";
import { responseFactory } from "../utility/response_factory";

const createUpdateJobOffer: AzureFunction = async (context: Context, req: HttpRequest, outputDocument: any): Promise<void> => {
    const user_id = await validateToken(req.headers);

    if (user_id == "No Token Found") {
        context.res = responseFactory("Token not found.", 401);
        return;
    }

    if (user_id == "Invalid Session") {
        context.res = responseFactory("Token invalid.", 401);
        return;
    }

    if (context.req && context.req.body && context.req.body.RSU && context.req.body.signing_bonus 
        && context.req.body.relocation_bonus && context.req.body.title && context.req.body.salary 
        && context.req.body.company && context.req.body.city_id && context.req.body.state_id) {
            context.bindings.outputDocument = JSON.stringify({
                id: context.req.body.id ? context.req.body.id : uuidv4(),
                user_id: user_id,
                RSU: parseFloat(context.req.body.RSU),
                signing_bonus: parseFloat(context.req.body.signing_bonus),
                relocation_bonus: parseFloat(context.req.body.relocation_bonus),
                title: context.req.body.title,
                salary: parseFloat(context.req.body.salary),
                company: context.req.body.company,
                city_id: context.req.body.city_id,
                state_id: context.req.body.state_id
            });
            context.res = responseFactory("Record added to Cosmos DB.");
    } else {
        context.res = responseFactory("Need to include preferences for a job offer.", 400);
    }
};

export default createUpdateJobOffer;