import { Context } from '@azure/functions'
import {
    stubContextFromBindingDefinitions,
    createHttpTrigger,
} from 'stub-azure-function-context'
import getStates from '..'
import { FakeStateCalifornia } from '../../mock_data/MockState'
import { State } from '../../types/database_types'
import { stateToBasicStateInfo } from '../../utility/type_mappings'

describe('GetStates tests', () => {
    it('Gives 404 on no states found', async () => {
        const res = await mockedRequestFactory(null)

        expect(res.statusCode).toEqual(404)

        expect(res.body).toEqual(JSON.stringify('No states found'))
    }),

    it('Gives returns states when found in DB', async () => {
        const res = await mockedRequestFactory([FakeStateCalifornia])

        expect(res.body).toEqual(JSON.stringify([stateToBasicStateInfo(FakeStateCalifornia)]));
    })
})

const mockedRequestFactory = async (state: State[]) => {
    const context: Context = stubContextFromBindingDefinitions([
        {
            type: 'httpTrigger',
            name: 'req',
            direction: 'in',
            data: createHttpTrigger(
                'GET',
                'http://example.com/states/{test_id}'
            ),
        },
        { type: 'http', name: '$return', direction: 'out' }
    ])

    await getStates(context, context.req, state);

    return context.res;
}