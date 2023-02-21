import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { City } from "../types/database_types";
import { cityToCityDetails } from "../utility/type_mappings";


const getCityDetails: AzureFunction = async (context: Context, req: HttpRequest, city: City | null): Promise<void> => {
    if (!city) {
        context.res = {
            status: 404,
            body: "City not found"
        }
        return;
    }

    context.res = {
        body: JSON.stringify(cityToCityDetails(city))
    }
};

export default getCityDetails;