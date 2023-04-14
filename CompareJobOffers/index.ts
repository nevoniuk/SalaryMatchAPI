import { SqlQuerySpec } from "@azure/cosmos";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { citiesContainer, jobOffersContainer, usersContainer } from "../cosmosClient";
import { City, JobOffer, User } from "../types/database_types";
import { responseFactory } from "../utility/response_factory";
import { validateToken } from "../utility/validateToken";
import { createOfferComparison } from "./createJobOfferComparison";

const compareJobOffers: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
    const user_id = await validateToken(req.headers);

    if (user_id == "No Token Found") {
        context.res = responseFactory("Token not found.", 401);
        return;
    }
    if (user_id == "Invalid Session") {
        context.res = responseFactory("Token invalid.", 401);
        return;
    }

    if (!req.body || !req.body.offer1ID || !req.body.offer2ID) {
        context.res = responseFactory("Need to include offer1ID and offer2ID in the request body.", 401);
        return;
    }

    const offer1 = (await jobOffersContainer.item(req.body.offer1ID, req.body.offer1ID).read<JobOffer>()).resource;
    const offer2 = (await jobOffersContainer.item(req.body.offer2ID, req.body.offer2ID).read<JobOffer>()).resource;

    if (!offer1 || !offer2) {
        context.res = responseFactory("One or both job offers do not exist", 400);
        return;
    }

    if (offer1.user_id !== user_id || offer2.user_id !== user_id) {
        context.res = responseFactory("User does not have access to one or both job offers.", 401);
        return;
    }

    const city1Query: SqlQuerySpec = {
        query: "SELECT * FROM c WHERE LOWER(c.name) = LOWER(@name)",
        parameters: [
            {
                name: "@name",
                value: offer1.city_id
            }
        ]
    };
    const city2Query: SqlQuerySpec = {
        query: "SELECT * FROM c WHERE LOWER(c.name) = LOWER(@name)",
        parameters: [
            {
                name: "@name",
                value: offer2.city_id
            }
        ]
    };

    const { resources: offer1Cities }: { resources: City[] } = await citiesContainer.items.query(city1Query).fetchAll();
    const { resources: offer2Cities }: { resources: City[] } = await citiesContainer.items.query(city2Query).fetchAll();

    const city1 = offer1Cities.length > 0 ? offer1Cities[0] : null;
    const city2 = offer2Cities.length > 0 ? offer2Cities[0] : null;

    const user = (await usersContainer.item(user_id, user_id).read<User>()).resource;

    context.res = responseFactory(createOfferComparison(offer1, offer2, city1, city2, user));
};

export default compareJobOffers;