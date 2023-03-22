import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { City } from "../types/database_types";
import { responseFactory } from "../utility/response_factory";
import { cityToCityDetails } from "../utility/type_mappings";


const getCityDetails: AzureFunction = async (context: Context, req: HttpRequest, city: City | null): Promise<void> => {
    if (!city) {
        context.res = responseFactory("City not found", 404);
        return;
    }

    context.res = responseFactory(cityToCityDetails(city));
};

export default getCityDetails;