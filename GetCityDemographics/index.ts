import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { City } from "../types/database_types";
import { cityToCityDemographics } from "../utility/type_mappings";


const getCityDemographics: AzureFunction = async (context: Context, req: HttpRequest, city: City | null): Promise<void> => {
    if (!city) {
        context.res = {
            status: 404,
            body: "City not found"
        }
        return;
    }

    context.res = {
        body: JSON.stringify(cityToCityDemographics(city))
    }
};

export default getCityDemographics;