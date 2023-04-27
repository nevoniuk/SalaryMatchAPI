import { Context } from '@azure/functions'
import {
    stubContextFromBindingDefinitions,
    createHttpTrigger,
} from 'stub-azure-function-context'
import CreateUserFavorites from '..'
import { UserFavorites} from '../../types/database_types'
import { v4 as uuidv4 } from "uuid";
import { loginAttemptsContainer } from "../../cosmosClient";

let loginToken1: {
    id: any,
    email: string,
    login_time: string
};
let loginToken2: {
    id: any,
    email: string,
    login_time: string
};

const fakeFavorite: UserFavorites = {
    id: "123",
    user_id: "integrationuser",
    city_id: "134",
    company_id: "135",
}
const fakeFavoritenoCity: UserFavorites = {
    id: "123",
    user_id: "integrationuser",
    city_id: "",
    company_id: "135",
}
const fakeFavoritenoCompany: UserFavorites = {
    id: "123",
    user_id: "integrationuser",
    city_id: "134",
    company_id: "",
}
const fakeFavoriteNeither: UserFavorites = {
    id: "123",
    user_id: "integrationuser",
    city_id: "",
    company_id: "",
}


describe('CreateUserFavorite Integration tests', () => {

    beforeAll(() => {
        return prepareCosmosDB();
    }),

    afterAll(() => {
        return cleanUpCosmosDB();
    }),

    it('User does not match account', async () => {
        loginToken2 = {
            id: uuidv4(),
            email: "integrationuser",
            login_time: Date()
        }
        const response = await mockedRequestFactory(fakeFavorite);
        expect(response.statusCode).toEqual(401);
        expect(response.body).toEqual("\"Token invalid.\"");
    }),


    it('Token not given', async () => {
        const response = await falsemockedRequestFactory(fakeFavorite);
        expect(response.statusCode).toEqual(401);
        expect(response.body).toEqual("\"Token not found.\"");
    }),

    it('Success', async () => {
        loginToken2 = loginToken1;
        const response = await mockedRequestFactory(fakeFavorite);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual("\"Record added to Cosmos DB.\"");
    }),

    it('Neither city or company given', async () => {
        loginToken2 = loginToken1;
        const response = await mockedRequestFactory(fakeFavoriteNeither);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual("\"No Favorite Included\"");
    }),

    it('Only company given', async () => {
        loginToken2 = loginToken1;
        const response = await mockedRequestFactory(fakeFavoritenoCity);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual("\"Record added to Cosmos DB.\"");
    }),

    it('Only city given', async () => {
        loginToken2 = loginToken1;
        const response = await mockedRequestFactory(fakeFavoritenoCompany);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual("\"Record added to Cosmos DB.\"");
    })

})

const mockedRequestFactory = async (body: Record<string, any>) => {
    const context: Context = stubContextFromBindingDefinitions([
        {
            type: 'httpTrigger',
            name: 'req',
            direction: 'in',
            data: createHttpTrigger(
                'POST',
                'http://example.com/userfavorites',
                {
                    "Authorization": `Bearer ${loginToken2.id}`
                },
                {},
                body
            ),
        }
    ])
    await CreateUserFavorites(context, context.req);
    return context.res;
}


const falsemockedRequestFactory = async (body: Record<string, any>) => {
    const context: Context = stubContextFromBindingDefinitions([
        {
            type: 'httpTrigger',
            name: 'req',
            direction: 'in',
            data: createHttpTrigger(
                'POST',
                'http://example.com/userfavorites'
            ),
        },
        { type: 'http', name: '$return', direction: 'out' }
    ])
    await CreateUserFavorites(context, context.req);

    return context.res;
}


const prepareCosmosDB = async () => {
    loginToken1 = {
        id: uuidv4(),
        email: "integrationuser",
        login_time: Date()
    }
    await loginAttemptsContainer.items.create(loginToken1);
}

const cleanUpCosmosDB = async () => {
    await loginAttemptsContainer.item(loginToken1.id, loginToken1.id).delete();
    
}