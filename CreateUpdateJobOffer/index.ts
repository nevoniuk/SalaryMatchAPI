import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { JobOffer } from "../types/database_types";


const createUpdateJobOffer: AzureFunction = async (context: Context, req: HttpRequest, outputDocument: any): Promise<void> => {
    if (context.req && context.req.body && context.req.body.id && context.req.body.RSU && context.req.body.signing_bonus 
        && context.req.body.relocation_bonus && context.req.body.title && context.req.body.salary 
        && context.req.body.company && context.req.body.city && context.req.body.state) {
            context.bindings.outputDocument = JSON.stringify({
                id: context.req.body.id,
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