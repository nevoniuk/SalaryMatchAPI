import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { State } from "../types/database_types";
import { stateToBasicStateInfo } from "../utility/type_mappings";

const getStates: AzureFunction = async (context: Context, req: HttpRequest, states: State[] | null): Promise<void> => {
    if (!states) {
        context.res = {
            status: 404,
            body: "No states found"
        }
        return;
    }

    context.res = {
        body: states.map((state) => stateToBasicStateInfo(state))
    }
};

export default getStates;