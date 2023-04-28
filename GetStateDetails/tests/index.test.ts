import { Context } from '@azure/functions'
import {
    stubContextFromBindingDefinitions,
    createHttpTrigger,
} from 'stub-azure-function-context'
import getStateDetails from '..'
import { FakeStateCalifornia } from '../../mock_data/MockState'
import { State } from '../../types/database_types'
import { stateToStateDetails} from '../../utility/type_mappings'

describe('GetStates tests', () => {
    it('Gives 404 on no state found', async () => {
        const res = await mockedRequestFactory(null)

        expect(res.statusCode).toEqual(404)

        expect(res.body).toEqual(JSON.stringify('State not found'))
    })

    // As a user, I would like to know state information (internet price, taxes).
    it('returns state information', async () => {
        const res = await mockedRequestFactory(FakeStateCalifornia)
        expect(res.body).toEqual(JSON.stringify(stateToStateDetails(FakeStateCalifornia)));
    })
})

const mockedRequestFactory = async (state: State) => {
    const context: Context = stubContextFromBindingDefinitions([
        {
            type: 'httpTrigger',
            name: 'req',
            direction: 'in',
            data: createHttpTrigger(
                'GET',
                'http://example.`com`/states/{test_id}'
            ),
        },
        { type: 'http', name: '$return', direction: 'out' }
    ])

    await getStateDetails(context, context.req, state);
    return context.res;
}