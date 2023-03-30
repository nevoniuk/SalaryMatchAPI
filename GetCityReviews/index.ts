import { SqlQuerySpec } from "@azure/cosmos";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { cityReviewsContainer } from "../cosmosClient";
import { CityReview } from "../types/database_types";
import { responseFactory } from "../utility/response_factory";
import { cityReviewToBasicCityReviewInfo } from "../utility/type_mappings";

const getCityReviews: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
    const cityReviewQuery: SqlQuerySpec = {
        query: "SELECT * FROM c WHERE c.city_id = @city_id",
        parameters: [
          {
            name: "@city_id",
            value: context.bindingData.city_id
          }
        ]
    };

    const { resources: cityReviews }: { resources: CityReview[] } = await cityReviewsContainer.items.query(cityReviewQuery).fetchAll();
    context.res = responseFactory(cityReviews.map((cityReview) => cityReviewToBasicCityReviewInfo(cityReview)));
};

export default getCityReviews;