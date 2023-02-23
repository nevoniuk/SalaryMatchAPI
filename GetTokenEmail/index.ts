import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { database } from "../cosmosClient";

const getTokenEmail: AzureFunction = async (context: Context, req: HttpRequest, outputDocument: any): Promise<void> => {
    if (context.req && context.req.body && context.req.body.id) {
            
            var validToken = false;
            const item  = await (await database.container("LoginAttempts").item(context.req.body.id, context.req.body.id).read());

            if(item.statusCode == 200){
                validToken = true;
            }

            if(validToken){
                context.res = {
                    status: 200,
                    body: item.resource.email
                }
            } else {
                context.res = {
                    status: 400,
                    body: "Invalid Session"
                }
            }
    } else {
        context.res = {
            status: 400,
            body: "Please pass user token"
        }
    }
};

export default getTokenEmail;