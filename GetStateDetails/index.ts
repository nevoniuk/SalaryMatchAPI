import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { State } from "../types/database_types";
import { stateToStateDetails } from "../utility/type_mappings";

const getStateDetails: AzureFunction = async (context: Context, req: HttpRequest, state: State | null): Promise<void> => {
    if (!state) {
        context.res = {
            status: 404,
            body: "State not found"
        }
        return;
    }

    context.res = {
        body: JSON.stringify(stateToStateDetails(state))
    }
};

export default getStateDetails;