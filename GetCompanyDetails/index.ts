import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Company } from "../types/database_types";
import { companyToBasicCompanyInfo, companyToCompanyDetails } from "../utility/type_mappings";

const getCompanyDetails: AzureFunction = async (context: Context, req: HttpRequest, company: Company | null): Promise<void> => {
    if (!company) {
        context.res = {
            status: 404,
            body: "Company not found"
        }
        return;
    }

    context.res = {
        body: JSON.stringify(companyToCompanyDetails(company))
    }
};

export default getCompanyDetails;