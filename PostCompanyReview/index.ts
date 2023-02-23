import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { randomUUID } from "crypto";
import { validateToken } from "../utility/validateToken";

const postCompanyReview: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
    if (!(req.headers['Authorization'] || req.headers['authorization'])) {
        context.res = {
            status: 401,
            body: "No bearer token found."
        }
        return;
    }

    const user_id = await validateToken((req.headers['Authorization'] || req.headers['authorization']));

    if (user_id == "Invalid Session") {
        context.res = {
            status: 401,
            body: "Token invalid."
        }
        return;
    }

    if (context.req && context.req.body && context.req.body.is_anonymous !== undefined 
        && context.req.body.overall_rating && context.req.body.comment) {
            context.bindings.companyReview = JSON.stringify({
                id: randomUUID(),
                user_id: user_id,
                is_anonymous: context.req.body.is_anonymous,
                company_id: context.bindingData.company_id,
                overall_rating: context.req.body.overall_rating,
                comment: context.req.body.comment
            });
            context.res = {
                body: "Record added to Cosmos DB"
            }
    } else {
        context.res = {
            status: 400,
            body: "Need to include is_anonymous, overall_rating, and comment in request body."
        }
    }
};

export default postCompanyReview;