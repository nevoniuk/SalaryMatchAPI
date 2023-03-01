import { SqlQuerySpec } from "@azure/cosmos";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { companyReviewsContainer } from "../cosmosClient";
import { CompanyReview } from "../types/database_types";
import { responseFactory } from "../utility/response_factory";
import { companyReviewToBasicCompanyReviewInfo } from "../utility/type_mappings";
/*
    Allows users to search for states and get basic info about them. Matches any states with names that
    contain the entered search string.
*/
const getCompanyReviews: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
    const companyReviewQuery: SqlQuerySpec = {
        query: "SELECT * FROM c WHERE c.company_id = @company_id",
        parameters: [
          {
            name: "@company_id",
            value: context.bindingData.company_id
          }
        ]
    };

    const { resources: companyReviews }: { resources: CompanyReview[] } = await companyReviewsContainer.items.query(companyReviewQuery).fetchAll();
    context.res = responseFactory(companyReviews.map((companyReview) => companyReviewToBasicCompanyReviewInfo(companyReview)));
};

export default getCompanyReviews;