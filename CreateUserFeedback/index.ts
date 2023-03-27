import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { v4 as uuidv4 } from "uuid";

const CreateUserFeedback: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    if (context.req && context.req.body && context.req.body.first_name && context.req.body.last_name 
        && context.req.body.email && context.req.body.message) {
            context.bindings.outputDocument = JSON.stringify({
                id: context.req.body.id ? context.req.body.id : uuidv4(),
                first_name: context.req.body.first_name,
                last_name: context.req.body.last_name,
                email: context.req.body.email,
                message: context.req.body.message
            });
            context.res = {
                body: "Record added to Cosmos DB"
            }
    } else {
        context.res = {
            status: 400,
            body: "Need to include feedback"
        }
    }
};

export default CreateUserFeedback;