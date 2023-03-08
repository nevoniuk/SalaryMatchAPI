import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { loginAttemptsContainer } from "../cosmosClient";
import { responseFactory } from "../utility/response_factory";

const getTokenEmail: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
    if (context.req && context.req.body && context.req.body.id) {
            
            var validToken = false;
            const item  = await loginAttemptsContainer.item(context.req.body.id, context.req.body.id).read();

            if(item.statusCode == 200){
                validToken = true;
            }

            if(validToken){
                context.res = responseFactory(item.resource.email);
            } else {
                context.res = responseFactory("Invalid Session", 400);
            }
    } else {
        context.res = responseFactory("Please pass user token", 400);
    }
};

export default getTokenEmail;