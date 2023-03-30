import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { randomUUID } from "crypto";
import { responseFactory } from "../utility/response_factory";
import { validateToken } from "../utility/validateToken";

const postCityReview: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
    const user_id = await validateToken(req.headers);

    if (user_id == "No Token Found") {
        context.res = responseFactory("Token not found.", 401);
        return;
    }

    if (user_id == "Invalid Session") {
        context.res = responseFactory("Token invalid.", 401);
        return;
    }

    if (context.req && context.req.body && context.req.body.is_anonymous !== undefined 
        && context.req.body.overall_rating && context.req.body.comment) {
            context.bindings.cityReview = JSON.stringify({
                id: randomUUID(),
                user_id: context.req.body.user_id,
                is_anonymous: context.req.body.is_anonymous,
                city_id: context.bindingData.city_id,
                overall_rating: context.req.body.overall_rating,
                comment: context.req.body.comment
            });
            context.res = responseFactory("Record added to Cosmos DB");
    } else {
        context.res = responseFactory("Need to include is_anonymous, overall_rating, and comment in request body.", 400);
    }
};

export default postCityReview;