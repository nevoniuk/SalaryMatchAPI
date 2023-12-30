/* Reference repository on how to create unit tests and mock context for azure functions app
https://github.com/martijn/azure-functions-typescript-jest-example
Reference Article below:
https://storck.io/posts/writing-testing-azure-functions-with-typescript/
*/
/*
import { Context } from '@azure/functions'
import {
    stubContextFromBindingDefinitions,
    createHttpTrigger,
    addTrigger,
} from 'stub-azure-function-context'
import UpdateUser from '../index'
import { mockUser } from '../../mock_data/MockUsers'
import { User } from '../../types/database_types'
import { isContext } from 'vm'
import { CosmosClient } from '@azure/cosmos'


//import { companyToBasicCompanyInfo } from '../../utility/type_mappings'

describe('Update User tests', () => {
    
    const promiseresponse = jest.fn().mockReturnValue(Promise.resolve(true));
    const putFN = jest.fn().mockImplementation(() => ({ promise:promiseresponse}));
    class CosmosClient {
        put = putFN;
    }
    const cosmosdb = {
        CosmosClient,
    }
    it('Gives 400 on no preferences', async () => {
        
        const res = await mockedRequest(null)
        expect(res.status).toEqual(400);
    }),
    
    it('updates the user otherwise if all fields in the request included', async () => {
        
        const res = await mockedRequest(mockUser)
        expect(res.status).toEqual(200);
    })
})

const mockedRequest = async (user: User) => {
    const context: Context = stubContextFromBindingDefinitions([
        {
            type: 'httpTrigger',
            name: 'req',
            direction: 'in',
            data: createHttpTrigger(
                'POST',
                'http://example.com/users/{testid}',
                {}, //originalurl
                {}, //headers
                {}, //no query
                {}, //no params,
                user,
                {},
            ),
        },

        { type: 'http', name: '$return', direction: 'out' },
        { type: 'cosmosDB', name: 'outputDocument', direction: 'out', "databaseName": "SalaryMatchDB",
        "collectionName": "Users",
        "connectionStringSetting": "CosmosDbConnectionString",
        "createIfNotExists": false }
    ])
    
    await UpdateUser(context, context.req, mockUser);

    return context.res;
}
*/