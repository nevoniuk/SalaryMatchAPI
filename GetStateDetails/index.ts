import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { State } from "../types/database_types";
import { responseFactory } from "../utility/response_factory";
import { stateToStateDetails } from "../utility/type_mappings";

const getStateDetails: AzureFunction = async (context: Context, req: HttpRequest, state: State | null): Promise<void> => {
    if (!state) {
        context.res = responseFactory("State not found", 404);
        return;
    }

    context.res = responseFactory(stateToStateDetails(state));
};

export default getStateDetails;