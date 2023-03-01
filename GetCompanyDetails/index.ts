import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Company } from "../types/database_types";
import { responseFactory } from "../utility/response_factory";
import { companyToBasicCompanyInfo, companyToCompanyDetails } from "../utility/type_mappings";

const getCompanyDetails: AzureFunction = async (context: Context, req: HttpRequest, company: Company | null): Promise<void> => {
    if (!company) {
        context.res = responseFactory("Company not found", 404);
        return;
    }

    context.res = responseFactory(companyToCompanyDetails(company));
};

export default getCompanyDetails;