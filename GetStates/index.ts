import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { State } from "../types/database_types";
import { responseFactory } from "../utility/response_factory";
import { stateToBasicStateInfo } from "../utility/type_mappings";

const getStates: AzureFunction = async (context: Context, req: HttpRequest, states: State[] | null): Promise<void> => {
    if (!states) {
        context.res = responseFactory("No states found", 404);
        return;
    }

    context.res = responseFactory(states.map((state) => stateToBasicStateInfo(state)));
};

export default getStates;