import { HttpRequestHeaders } from "@azure/functions";
import { loginAttemptsContainer } from "../cosmosClient";

export const validateToken = async (requestHeaders: HttpRequestHeaders): Promise<string> => {
    if (!(requestHeaders['Authorization'] || requestHeaders['authorization'])) {
        return "No Token Found";
    }

    var validToken = false;

    // Removes the string "Bearer " from the token
    const strippedToken = (requestHeaders['Authorization'] || requestHeaders['authorization']).slice(7);

    const item = await loginAttemptsContainer.item(strippedToken, strippedToken).read();

    if (item.statusCode == 200){
        validToken = true;
    }

    if (validToken){
        return item.resource.email;     
    } else {
        return "Invalid Session";
    }
}