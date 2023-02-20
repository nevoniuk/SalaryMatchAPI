import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { JobOffer } from "../types/database_types";

const getJobOffers: AzureFunction = async (context: Context, req: HttpRequest, joboffers: JobOffer[] | null): Promise<void> => {
    if (!joboffers) {
        context.res = {
            status: 404,
            body: "No job offers found"
        }
        return;
    }

    context.res = {
        body: joboffers
    }
};

export default getJobOffers;