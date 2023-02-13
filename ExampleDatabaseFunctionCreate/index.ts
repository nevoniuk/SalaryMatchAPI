import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const exampleDatabaseFunctionCreate: AzureFunction = async (context: Context, req: HttpRequest, outputDocument: any): Promise<void> => {
    if (context.req && context.req.body && context.req.body.id && context.req.body.name && context.req.body.employeeId 
        && context.req.body.address) {
            context.bindings.outputDocument = JSON.stringify({
                id: context.req.body.id + "-" + context.req.body.employeeId,
                name: context.req.body.name,
                employeeId: context.req.body.employeeId,
                address: context.req.body.address
            });
            context.res = {
                body: "Record added to Cosmos DB"
            }
    } else {
        context.res = {
            status: 400,
            body: "Need to include id, name, employeeId, and address in request body."
        }
    }
};

export default exampleDatabaseFunctionCreate;