import { Context } from '@azure/functions'
import {
    stubContextFromBindingDefinitions,
    createHttpTrigger,
} from 'stub-azure-function-context'
import getCityDetails from '..'
import { FakeCityChicago } from '../../mock_data/MockCities'
import { City, Company } from '../../types/database_types'
import { cityToCityDetails, companyToBasicCompanyInfo } from '../../utility/type_mappings'

describe('GetCityDetails tests', () => {
    it('Gives 404 on no city found', async () => {
        const res = await mockedRequestFactory(null);

        expect(res.statusCode).toEqual(404);

        expect(res.body).toEqual(JSON.stringify('City not found'));
    }),

    it('Returns city when found in DB', async () => {
        const res = await mockedRequestFactory(FakeCityChicago);

        expect(res.body).toEqual(JSON.stringify(cityToCityDetails(FakeCityChicago)));
    })
})

const mockedRequestFactory = async (city: City) => {
    const context: Context = stubContextFromBindingDefinitions([
        {
            type: 'httpTrigger',
            name: 'req',
            direction: 'in',
            data: createHttpTrigger(
                'GET',
                'http://example.com/cities/{test_id}'
            ),
        },
        { type: 'http', name: '$return', direction: 'out' }
    ])

    await getCityDetails(context, context.req, city);

    return context.res;
}