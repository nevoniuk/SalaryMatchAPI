import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { State } from "../types/database_types";
import { stateToStateTaxInfo } from "../utility/type_mappings";

const getStateTaxInfo: AzureFunction = async (context: Context, req: HttpRequest, state: State | null): Promise<void> => {
    if (!state) {
        context.res = {
            status: 404,
            body: "City not found"
        }
        return;
    }

    context.res = {
        body: JSON.stringify(stateToStateTaxInfo(state))
    }
};

export default getStateTaxInfo;