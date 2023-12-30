import { Context } from '@azure/functions'
import {
    stubContextFromBindingDefinitions,
    createHttpTrigger,
} from 'stub-azure-function-context'
import DeleteFavorite from '..'
import { fakeFavorite, differentFakeFavorite } from '../../mock_data/MockFavorites'
import { v4 as uuidv4 } from "uuid";
import { userFavoritesContainer } from "../../cosmosClient";
import { loginAttemptsContainer } from "../../cosmosClient";
import {UserFavorites} from "../../types/database_types";

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
let loginToken3: {
    id: any,
    email: string,
    login_time: string
};

const IDone = {"id": fakeFavorite.id};
const IDtwo = {"id": differentFakeFavorite.id};


//case 1: correct id deleted
//case 2: id given that does not belong to the user

describe('DeleteFavorite Integration tests', () => {


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
        loginToken1 = loginToken2;
        const response = await mockedRequestFactory(IDone);
        expect(response.statusCode).toEqual(401);
        expect(response.body).toEqual("\"Token invalid.\"");
		loginToken1 = loginToken3;
    }),

	it('Token not given', async () => {
        const response = await falsemockedRequestFactory(IDone);
        expect(response.statusCode).toEqual(401);
        expect(response.body).toEqual("\"Token not found.\"");
    }),

	it('Favorite found but not users ', async () => {
		loginToken1 = loginToken3;
        await userFavoritesContainer.items.create(differentFakeFavorite);
        const response = await mockedRequestFactory(IDtwo);
        expect(response.statusCode).toEqual(404);
        expect(response.body).toEqual("\"Not your user favorite.\"")
        await userFavoritesContainer.item(differentFakeFavorite.id, differentFakeFavorite.id).delete();
    })
/** it('Correct favorite deleted', async () => {
		loginToken1 = loginToken3;
        const response = await mockedRequestFactory(IDone);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual("\"Item deleted.\"")
    })*/

})

const mockedRequestFactory = async (body: Record<string, any>) => {
    const context: Context = stubContextFromBindingDefinitions([
        {
            type: 'httpTrigger',
            name: 'req',
            direction: 'in',
            data: createHttpTrigger(
                'DELETE',
                'http://example.com/userfavorites',
                {
                    "Authorization": `Bearer ${loginToken1.id}`
                },
                {},
                body
            ),
        },
        { type: 'http', name: '$return', direction: 'out' }
    ])

    await DeleteFavorite(context, context.req);

    return context.res;
}


const falsemockedRequestFactory = async (body: Record<string, any>) => {
    const context: Context = stubContextFromBindingDefinitions([
        {
            type: 'httpTrigger',
            name: 'req',
            direction: 'in',
            data: createHttpTrigger(
                'DELETE',
                'http://example.com/userfavorites',
                {},
                {},
                body
            ),
        },
        { type: 'http', name: '$return', direction: 'out' }
    ])

    await DeleteFavorite(context, context.req);

    return context.res;
}


const prepareCosmosDB = async () => {
	loginToken1 = {
        id: uuidv4(),
        email: "integrationuser",
        login_time: Date()
    }
    
    loginToken3 = loginToken1;
    await loginAttemptsContainer.items.create(loginToken1); //already in system??
    await userFavoritesContainer.items.create(fakeFavorite);
    //await loginAttemptsContainer.items.create(loginToken2);
    //await userFavoritesContainer.items.create(differentFakeFavorite);
}

const cleanUpCosmosDB = async () => {
    await loginAttemptsContainer.item(loginToken1.id, loginToken1.id).delete();
	await userFavoritesContainer.item(fakeFavorite.id, fakeFavorite.id).delete();
}
