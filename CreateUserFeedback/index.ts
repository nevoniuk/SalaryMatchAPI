import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { v4 as uuidv4 } from "uuid";
import { responseFactory } from "../utility/response_factory";
const CreateUserFeedback: AzureFunction = async function (context: Context, req: HttpRequest, outputDocument: any): Promise<void> {
    if (context.req && context.req.body && context.req.body.first_name && context.req.body.last_name 
        && context.req.body.email && context.req.body.message) {
            context.bindings.outputDocument = JSON.stringify({
                id: uuidv4(),
                first_name: context.req.body.first_name,
                last_name: context.req.body.last_name,
                email: context.req.body.email,
                message: context.req.body.message
            });
            context.res = responseFactory("Record added to Cosmos DB.");
    } else {
        context.res = responseFactory("Need to include feedback.", 400);
    }
};

export default CreateUserFeedback;