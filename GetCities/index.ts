import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { City } from "../types/database_types";
import { responseFactory } from "../utility/response_factory";
import { cityToBasicCityInfo } from "../utility/type_mappings";

const getCities: AzureFunction = async (context: Context, req: HttpRequest, cities: City[] | null): Promise<void> => {
    if (!cities) {
        context.res = responseFactory("No cities found", 404);
        return;
    }

    context.res = responseFactory(cities.map((city) => cityToBasicCityInfo(city)));
};

export default getCities;