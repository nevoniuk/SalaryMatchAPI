import { SqlQuerySpec } from "@azure/cosmos";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { citiesContainer, jobOffersContainer, usersContainer } from "../cosmosClient";
import { City, JobOffer, User } from "../types/database_types";
import { JobOfferComparison } from "../types/object_transfer_types";
import { responseFactory } from "../utility/response_factory";
import { validateToken } from "../utility/validateToken";

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

    // Database querying and validation

    const offer1 = (await jobOffersContainer.item(req.body.offer1ID, req.body.offer1ID).read<JobOffer>()).resource;
    const offer2 = (await jobOffersContainer.item(req.body.offer2ID, req.body.offer2ID).read<JobOffer>()).resource;

    if (offer1.user_id !== user_id || offer2.user_id !== user_id) {
        context.res = responseFactory("User does not have access to one or both job offers.", 401);
        return;
    }

    const city1Query: SqlQuerySpec = {
        query: "SELECT * FROM c WHERE c.name = @name",
        parameters: [
            {
                name: "@name",
                value: offer1.city_id
            }
        ]
    };
    const city2Query: SqlQuerySpec = {
        query: "SELECT * FROM c WHERE c.name = @name",
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
    const city2 = offer2Cities.length > 0 ? offer1Cities[0] : null;

    const user = (await usersContainer.item(user_id, user_id).read<User>()).resource;

    let offer1SalaryMatch = false;
    let offer2SalaryMatch = false;

    switch (user.salary_preference) {
        case "Over 50,000":
            offer1SalaryMatch = offer1.salary > 50000;
            offer2SalaryMatch = offer2.salary > 50000;
            break;
        case "Over 100,000":
            offer1SalaryMatch = offer1.salary > 100000;
            offer2SalaryMatch = offer2.salary > 100000;
            break;
        case "Over 200,000":
            offer1SalaryMatch = offer1.salary > 200000;
            offer2SalaryMatch = offer2.salary > 200000;
            break;
    }

    // Comparison
    let offerComparison: JobOfferComparison = {
        offer1ID: offer1.id,
        offer1TotalCompensation: offer1.salary + offer1.RSU + offer1.relocation_bonus + offer1.signing_bonus,
        offer1TotalCompensationWithLivingCosts: offer1.salary + offer1.RSU + offer1.relocation_bonus + offer1.signing_bonus, // TODO
        offer1SalaryMatch: offer1SalaryMatch,

        offer2ID: offer2.id,
        offer2TotalCompensation: offer2.salary + offer2.RSU + offer2.relocation_bonus + offer2.signing_bonus,
        offer2TotalCompensationWithLivingCosts: offer2.salary + offer2.RSU + offer2.relocation_bonus + offer2.signing_bonus, // TODO
        offer2SalaryMatch: offer2SalaryMatch,
    }; 

    if (city1) {
        const city1PopulationDistribution = (city1.population_under_25 + city1.population_25_to_29) >= (city1.total_population * 0.5) ? "Young" : "Old";
        offerComparison = {
            ...offerComparison,
            offer1CityDemographicMatch: user.demographic_preference ? city1PopulationDistribution === user.demographic_preference : undefined,
        }
    }

    if (city2) {
        const city2PopulationDistribution = (city2.population_under_25 + city2.population_25_to_29) >= (city2.total_population * 0.5) ? "Young" : "Old";
        offerComparison = {
            ...offerComparison,
            offer2CityDemographicMatch: user.demographic_preference ? city2PopulationDistribution === user.demographic_preference : undefined,
        }
    }

    context.res = responseFactory(offerComparison);
};

export default compareJobOffers;