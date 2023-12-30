import { Context } from '@azure/functions'
import {
    stubContextFromBindingDefinitions,
    createHttpTrigger,
} from 'stub-azure-function-context'
import GetUserFavorites from '..'
import { fakeFavorite } from '../../mock_data/MockFavorites'
import { v4 as uuidv4 } from "uuid";
import { userFavoritesContainer } from "../../cosmosClient";
import { loginAttemptsContainer } from "../../cosmosClient";
import {UserFavorites} from "../../types/database_types"
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

describe('GetUserFavorite Integration tests', () => {

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
        const response = await mockedRequestFactory();
        expect(response.statusCode).toEqual(401);
        
        expect(response.body).toEqual("\"Token invalid.\"");
    }),


    it('Token not given', async () => {
        const response = await falsemockedRequestFactory();
        expect(response.statusCode).toEqual(401);
        expect(response.body).toEqual("\"Token not found.\"");
    }),

    it('Correct favorite returned', async () => {
        loginToken2 = loginToken1;
        const response = await mockedRequestFactory();
        expect(response.statusCode).toEqual(200);
        //expect(loginToken1).toEqual(loginToken2);
        let res = <UserFavorites[]>JSON.parse(response.body);
        expect(res.length).toEqual(1);
        expect(res[0].id).toEqual(fakeFavorite.id);
        expect(res[0].city_id).toEqual(fakeFavorite.city_id);
        expect(res[0].company_id).toEqual(fakeFavorite.company_id);
        expect(res[0].user_id).toEqual(fakeFavorite.user_id);
    })

})

const mockedRequestFactory = async () => {
    const context: Context = stubContextFromBindingDefinitions([
        {
            type: 'httpTrigger',
            name: 'req',
            direction: 'in',
            data: createHttpTrigger(
                'GET',
                'http://example.com/userfavorites',
                {
                    "Authorization": `Bearer ${loginToken2.id}`
                }
            ),
        },
        { type: 'http', name: '$return', direction: 'out' }
    ])

    await GetUserFavorites(context, context.req);

    return context.res;
}


const falsemockedRequestFactory = async () => {
    const context: Context = stubContextFromBindingDefinitions([
        {
            type: 'httpTrigger',
            name: 'req',
            direction: 'in',
            data: createHttpTrigger(
                'GET',
                'http://example.com/userfavorites'
            ),
        },
        { type: 'http', name: '$return', direction: 'out' }
    ])

    await GetUserFavorites(context, context.req);

    return context.res;
}


const prepareCosmosDB = async () => {
    loginToken1 = {
        id: uuidv4(),
        email: "integrationuser",
        login_time: Date()
    }
    await loginAttemptsContainer.items.create(loginToken1);
    await userFavoritesContainer.items.create(fakeFavorite);
}

const cleanUpCosmosDB = async () => {
    await loginAttemptsContainer.item(loginToken1.id, loginToken1.id).delete();
    await userFavoritesContainer.item(fakeFavorite.id, fakeFavorite.id).delete();
}