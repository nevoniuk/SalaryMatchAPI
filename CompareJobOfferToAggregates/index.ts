import { SqlQuerySpec } from "@azure/cosmos";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { citiesContainer, jobOffersContainer } from "../cosmosClient";
import { City, JobOffer } from "../types/database_types";
import { responseFactory } from "../utility/response_factory";
import { validateToken } from "../utility/validateToken";
import { createOfferAggregateComparison } from "./createJobOfferComparison";

const compareJobOfferToAggregates: AzureFunction = async (context: Context, req: HttpRequest, offer: JobOffer | null): Promise<void> => {
    const user_id = await validateToken(req.headers);

    if (user_id == "No Token Found") {
        context.res = responseFactory("Token not found.", 401);
        return;
    }
    if (user_id == "Invalid Session") {
        context.res = responseFactory("Token invalid.", 401);
        return;
    }

    if (!offer) {
        context.res = responseFactory("Job offer does not exist.", 400);
        return;
    }

    if (offer.user_id !== user_id) {
        context.res = responseFactory("User does not have access to job offer.", 401);
        return;
    }

    const sameCityOfferQuery: SqlQuerySpec = {
        query: "SELECT * FROM c WHERE LOWER(c.city_id) = LOWER(@city_id) AND LOWER(c.title) = LOWER(@title)",
        parameters: [
            {
                name: "@city_id",
                value: offer.city_id
            },
            {
                name: "@title",
                value: offer.title
            }
        ]
    };

    const sameCompanyOfferQuery: SqlQuerySpec = {
        query: "SELECT * FROM c WHERE LOWER(c.company) = LOWER(@company) AND LOWER(c.title) = LOWER(@title)",
        parameters: [
            {
                name: "@company",
                value: offer.company
            },
            {
                name: "@title",
                value: offer.title
            }
        ]
    };

    const { resources: sameCityOffers }: { resources: JobOffer[] } = await jobOffersContainer.items.query(sameCityOfferQuery).fetchAll();
    const { resources: sameCompanyOffers }: { resources: JobOffer[] } = await jobOffersContainer.items.query(sameCompanyOfferQuery).fetchAll();

    const cities = (await citiesContainer.items.readAll<City>().fetchAll()).resources;

    context.res = responseFactory(createOfferAggregateComparison(sameCityOffers, sameCompanyOffers, cities));
};

export default compareJobOfferToAggregates;