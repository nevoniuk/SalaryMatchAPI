import { loginAttemptsContainer } from "../cosmosClient";

const validateToken = async (token:string): Promise<string> => {
    var validToken = false;
    const item  = await loginAttemptsContainer.item(token, token).read();

    if(item.statusCode == 200){
        validToken = true;
    }

    if(validToken){
        return item.resource.email      
    } else {
        return "Invalid Session"
    }
}