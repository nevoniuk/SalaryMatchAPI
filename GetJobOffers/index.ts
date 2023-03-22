import { SqlQuerySpec } from "@azure/cosmos";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { jobOffersContainer } from "../cosmosClient";
import { JobOffer } from "../types/database_types";
import { responseFactory } from "../utility/response_factory";
import { jobOfferToJobOfferDetails } from "../utility/type_mappings";
import { validateToken } from "../utility/validateToken";

const getJobOffers: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
    const user_id = await validateToken(req.headers);

    if (user_id == "No Token Found") {
        context.res = responseFactory("Token not found.", 401);
        return;
    }

    if (user_id == "Invalid Session") {
        context.res = responseFactory("Token invalid.", 401);
        return;
    }

    const jobOffersQuery: SqlQuerySpec = {
        query: "SELECT * FROM c WHERE c.user_id = @user_id",
        parameters: [
          {
            name: "@user_id",
            value: user_id
          }
        ]
    };

    const { resources: jobOffers }: { resources: JobOffer[] } = await jobOffersContainer.items.query(jobOffersQuery).fetchAll();
    context.res = responseFactory(jobOffers.map((jobOffer) => jobOfferToJobOfferDetails(jobOffer)));
};

export default getJobOffers;