import { Context } from '@azure/functions'
import {
    stubContextFromBindingDefinitions,
    createHttpTrigger,
} from 'stub-azure-function-context'
import getCompanyDetails from '..'
import { FakeCompanyGoogle } from '../../mock_data/MockCompanies'
import { Company } from '../../types/database_types'
import { companyToBasicCompanyInfo, companyToCompanyDetails} from '../../utility/type_mappings'

describe('GetCompanies tests', () => {
    it('Gives 404 on no companies found', async () => {
        const res = await mockedRequestFactory(null)

        expect(res.statusCode).toEqual(404)

        expect(res.body).toEqual(JSON.stringify('Company not found'))
    })

    // As a user, I would like to know company demographics (gender, race, title, degree).
    it('returns company demographcis', async () => {
        const res = await mockedRequestFactory(FakeCompanyGoogle)
        expect(res.body).toEqual(JSON.stringify(companyToCompanyDetails(FakeCompanyGoogle)));
    })
})

const mockedRequestFactory = async (company: Company) => {
    const context: Context = stubContextFromBindingDefinitions([
        {
            type: 'httpTrigger',
            name: 'req',
            direction: 'in',
            data: createHttpTrigger(
                'GET',
                'http://example.com/companies/{test_id}'
            ),
        },
        { type: 'http', name: '$return', direction: 'out' }
    ])

    await getCompanyDetails(context, context.req, company);
    return context.res;
}