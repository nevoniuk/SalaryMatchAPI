import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { usersContainer } from "../cosmosClient";
import { v4 as uuidv4 } from "uuid";

const login: AzureFunction = async (context: Context, req: HttpRequest, outputDocument: any): Promise<void> => {
    if (context.req && context.req.body && context.req.body.id && context.req.body.password) {

        var accountExists = false;
        const item = await usersContainer.item(context.req.body.id, context.req.body.id).read();

        if (item.statusCode == 200) {
            accountExists = true;
        }
        if (accountExists) {
            var passwordCorrect = false;
            //Check if passwords match
            if (item.resource.password == context.req.body.password) {
                passwordCorrect = true;
            }

            if (passwordCorrect) {
                //Generate Token
                const token = uuidv4();
                console.log(token)
                context.bindings.outputDocument = JSON.stringify({
                    id: token,
                    email: context.req.body.id,
                    login_time: Date()
                });
                context.res = {
                    status: 200,
                    body: token
                }
            } else {
                context.res = {
                    status: 400,
                    body: "Incorrect Password"
                }
            }
        } else {
            context.res = {
                status: 400,
                body: "Account does not exist"
            }
        }
    } else {
        context.res = {
            status: 400,
            body: "Please include account email and password"
        }
    }
};

export default login;