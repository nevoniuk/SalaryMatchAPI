import { Context } from '@azure/functions'
import {
    stubContextFromBindingDefinitions,
    createHttpTrigger,
} from 'stub-azure-function-context'
import getCompanies from '..'
import { FakeCompanyGoogle } from '../../mock_data/MockCompanies'
import { Company } from '../../types/database_types'
import { companyToBasicCompanyInfo } from '../../utility/type_mappings'

describe('GetCompanies tests', () => {
    it('Gives 404 on no cities found', async () => {
        const res = await mockedRequestFactory(null)

        expect(res.statusCode).toEqual(404)

        expect(res.body).toEqual(JSON.stringify('No companies found'))
    }),

    it('Gives returns cities when found in DB', async () => {
        const res = await mockedRequestFactory([FakeCompanyGoogle])

        expect(res.body).toEqual(JSON.stringify([companyToBasicCompanyInfo(FakeCompanyGoogle)]));
    })
})

const mockedRequestFactory = async (companies: Company[]) => {
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

    await getCompanies(context, context.req, companies);

    return context.res;
}