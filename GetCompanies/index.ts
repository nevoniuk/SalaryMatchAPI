import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Company } from "../types/database_types";
import { responseFactory } from "../utility/response_factory";
import { companyToBasicCompanyInfo } from "../utility/type_mappings";

const getCompanies: AzureFunction = async (context: Context, req: HttpRequest, companies: Company[] | null): Promise<void> => {
    if (!companies) {
        context.res = responseFactory("No companies found", 404);
        return;
    }

    context.res = responseFactory(companies.map((company) => companyToBasicCompanyInfo(company)));
};

export default getCompanies;