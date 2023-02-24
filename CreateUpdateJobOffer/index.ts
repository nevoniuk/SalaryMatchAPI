import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { JobOffer } from "../types/database_types";
import { validateToken } from "../utility/validateToken";
import { v4 as uuidv4 } from "uuid";

const createUpdateJobOffer: AzureFunction = async (context: Context, req: HttpRequest, outputDocument: any): Promise<void> => {
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

    if (context.req && context.req.body && context.req.body.RSU && context.req.body.signing_bonus 
        && context.req.body.relocation_bonus && context.req.body.title && context.req.body.salary 
        && context.req.body.company && context.req.body.city && context.req.body.state) {
            context.bindings.outputDocument = JSON.stringify({
                id: uuidv4(),
                user_id: user_id,
                RSU: context.req.body.RSU,
                signing_bonus: context.req.body.signing_bonus,
                relocation_bonus: context.req.body.relocation_bonus,
                title: context.req.body.title,
                salary: context.req.body.salary,
                company: context.req.body.company,
                city: context.req.body.city,
                state: context.req.body.state
            });
            context.res = {
                body: "Record added to Cosmos DB"
            }
    } else {
        context.res = {
            status: 400,
            body: "Need to include preferences for a job offer"
        }
    }
};

export default createUpdateJobOffer;