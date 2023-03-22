import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { responseFactory } from "../utility/response_factory";

const exampleDatabaseFunctionCreateUpdate: AzureFunction = async (context: Context, req: HttpRequest, outputDocument: any): Promise<void> => {
    if (context.req && context.req.body && context.req.body.id && context.req.body.name && context.req.body.employeeId 
        && context.req.body.address) {
            context.bindings.outputDocument = JSON.stringify({
                id: context.req.body.id + "-" + context.req.body.employeeId,
                name: context.req.body.name,
                employeeId: context.req.body.employeeId,
                address: context.req.body.address
            });
            context.res = responseFactory("Record added to Cosmos DB.");
    } else {
        context.res = responseFactory("Need to include id, name, employeeId, and address in request body.", 400);
    }
};

export default exampleDatabaseFunctionCreateUpdate;