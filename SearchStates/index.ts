import { SqlQuerySpec } from "@azure/cosmos";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { statesContainer } from "../cosmosClient";
import { State } from "../types/database_types";
import { responseFactory } from "../utility/response_factory";
import { stateToBasicStateInfo } from "../utility/type_mappings";

/*
    Allows users to search for states and get basic info about them. Matches any states with names that
    contain the entered search string.
*/
const searchStates: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
    const stateQuery: SqlQuerySpec = {
        query: "SELECT * FROM c WHERE LOWER(c.name) LIKE LOWER(@regexName)",
        parameters: [
          {
            name: "@regexName",
            value: `%${context.bindingData.searchString}%`
          }
        ]
    };

    const { resources: states }: { resources: State[] } = await statesContainer.items.query(stateQuery).fetchAll();
    context.res = responseFactory(states.map((state) => stateToBasicStateInfo(state)));
};

export default searchStates;