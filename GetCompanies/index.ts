import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Company } from "../types/database_types";
import { companyToBasicCompanyInfo } from "../utility/type_mappings";

const getCompanies: AzureFunction = async (context: Context, req: HttpRequest, companies: Company[] | null): Promise<void> => {
    if (!companies) {
        context.res = {
            status: 404,
            body: "No companies found"
        }
        return;
    }

    context.res = {
        body: JSON.stringify(companies.map((company) => companyToBasicCompanyInfo(company)))
    }
};

export default getCompanies;