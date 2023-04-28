import { Context } from '@azure/functions'
import {
    stubContextFromBindingDefinitions,
    createHttpTrigger,
} from 'stub-azure-function-context'
import getCompanyStockInfo from '..'
import { Company } from '../../types/database_types'
import { FakeCompanyGoogle, FakeCompanyYahoo } from '../../mock_data/MockCompanies'

describe('GetCompanyStockInfo tests', () => {
    it('Gives 404 on no companies found', async () => {
        const res = await mockedRequestFactory(null)

        expect(res.statusCode).toEqual(404)

        expect(res.body).toEqual(JSON.stringify('Company not found'))

    })

    it('returns company stock info', async () => {
        const res = await mockedRequestFactory(FakeCompanyGoogle)
        const stockInfo = JSON.parse(res.body)
        expect(stockInfo.stock_date).toBeDefined()
        expect(stockInfo.stock_price).toBeDefined()
        expect(Number(stockInfo.stock_price)).toBeGreaterThan(0)
        expect(res.statusCode).toEqual(200)
    })

    it('returns company not public', async () => {
        const res = await mockedRequestFactory(FakeCompanyYahoo)
        expect(res.body).toEqual(JSON.stringify('Company is not public'))
        expect(res.statusCode).toEqual(200)
    })

    it('returns error on company not found', async () => {
        const res = await mockedRequestFactory(null)
        expect(res.statusCode).toEqual(404);
        expect(res.body).toEqual(JSON.stringify('Company not found'));
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
                'http://example.com/stock/{test_id}'
            ),
        },
        { type: 'http', name: '$return', direction: 'out' }
    ])

    await getCompanyStockInfo(context, context.req, company);

    return context.res;
}