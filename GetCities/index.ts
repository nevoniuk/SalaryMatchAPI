import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { City } from "../types/database_types";
import { cityToBasicCityInfo } from "../utility/type_mappings";

const getCities: AzureFunction = async (context: Context, req: HttpRequest, cities: City[] | null): Promise<void> => {
    if (!cities) {
        context.res = {
            status: 404,
            body: "No cities found"
        }
        return;
    }

    context.res = {
        body: cities.map((city) => cityToBasicCityInfo(city))
    }
};

export default getCities;