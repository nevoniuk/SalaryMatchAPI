import { loginAttemptsContainer } from "../cosmosClient";

export const validateToken = async (token:string): Promise<string> => {
    var validToken = false;

    // Removes the string "Bearer " from the token
    const strippedToken = token.slice(7);

    const item  = await loginAttemptsContainer.item(strippedToken, strippedToken).read();

    if(item.statusCode == 200){
        validToken = true;
    }

    if(validToken){
        return item.resource.email      
    } else {
        return "Invalid Session"
    }
}