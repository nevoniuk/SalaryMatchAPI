import { database } from "../cosmosClient";

const validateToken = async (token:string): Promise<string> => {
    var validToken = false;
    const item  = await database.container("LoginAttempts").item(token, token).read();

    if(item.statusCode == 200){
        validToken = true;
    }

    if(validToken){
        return item.resource.email      
    } else {
        return "Invalid Session"
    }
}