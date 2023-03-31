import { Context } from '@azure/functions'
import { type } from 'os'
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
    // User story View the average food cost for a city
    it('Returns average food cost', async () => {
        const res = await mockedRequestFactory(FakeCityChicago);

        expect(JSON.parse(res.body).average_groceries_cost).toEqual(cityToCityDetails(FakeCityChicago).average_groceries_cost);
    })

    // User story As a user, I would like to know the weather/climate/sunlight of the area.
    it('Returns temperature data', async () => {
        const months = ["avg_temp_jan", "avg_temp_feb", "avg_temp_march", "avg_temp_april", "avg_temp_may", "avg_temp_june", "avg_temp_july", "avg_temp_aug", "avg_temp_sept", "avg_temp_oct", "avg_temp_nov", "avg_temp_dec"];
        for (let i = 0; i < months.length; i++) {
            const res = await mockedRequestFactory(FakeCityChicago);
            expect(JSON.parse(res.body)[months[i]]).toEqual(cityToCityDetails(FakeCityChicago)[months[i]]);
        }

    })

    // User story As a user, I would like to know the legality of specific options like abortion, firearms, marijuana, etc. for a city.
    it('Returns city legality data', async () => {
        const res = await mockedRequestFactory(FakeCityChicago);

        expect(JSON.parse(res.body).state_abortion_laws).toEqual(cityToCityDetails(FakeCityChicago).state_abortion_laws);
        expect(JSON.parse(res.body).state_cannabis_legality).toEqual(cityToCityDetails(FakeCityChicago).state_cannabis_legality);
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