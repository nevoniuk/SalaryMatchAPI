import { Context } from "@azure/functions";
import { companiesContainer, loginAttemptsContainer } from "../../cosmosClient";
import {
    stubContextFromBindingDefinitions,
    createHttpTrigger,
} from 'stub-azure-function-context';
import { v4 as uuidv4 } from "uuid";
import createUpdateJobOffer from "..";
import { JobOffer } from "../../types/database_types";
import { SqlQuerySpec } from "@azure/cosmos";
import { Company } from "../../types/database_types";

let loginToken: {
    id: any,
    email: string,
    login_time: string
};

const fakeOffer: JobOffer = {
    id: "fakeID",
    user_id: "integrationuser",
    RSU: 0,
    signing_bonus: 0,
    relocation_bonus: 1000,
    salary: 40000,
    title: "Code Monkey",
    company: "Test Company",
    city_id: "Chicago",
    state_id: "Illinois"
}

describe('CreateUpdateJobOffer integration tests', () => {
    beforeAll(() => {
        return prepareCosmosDB();
    }),

    afterAll(() => {
        return cleanUpCosmosDB();
    }),

    it('Creates a company if the one listed in the job offer does not exist', async () => {
        await mockedRequestFactory(fakeOffer);
        
        const companyQuery: SqlQuerySpec = {
            query: "SELECT * FROM c WHERE LOWER(c.name) = LOWER(@name)",
            parameters: [
                {
                    name: "@name",
                    value: fakeOffer.company
                }
            ]
        };
        const { resources: offerCompanyList }: { resources: Company[] } = await companiesContainer.items.query(companyQuery).fetchAll();
        expect(offerCompanyList.length).toEqual(1);

        for (const company of offerCompanyList) {
            await companiesContainer.item(company.id, company.id).delete();
        }
    }),

    it('Does not create a company if the one in the job offer already exists', async () => {
        await companiesContainer.items.create({
            name: fakeOffer.company
        });
        await mockedRequestFactory(fakeOffer);
        
        const companyQuery: SqlQuerySpec = {
            query: "SELECT * FROM c WHERE LOWER(c.name) = LOWER(@name)",
            parameters: [
                {
                    name: "@name",
                    value: fakeOffer.company
                }
            ]
        };
        const { resources: offerCompanyList }: { resources: Company[] } = await companiesContainer.items.query(companyQuery).fetchAll();
        expect(offerCompanyList.length).toEqual(1);

        for (const company of offerCompanyList) {
            await companiesContainer.item(company.id, company.id).delete();
        }
    })
})

const mockedRequestFactory = async (body: Record<string, any>) => {
    const context: Context = stubContextFromBindingDefinitions([
        {
            type: 'httpTrigger',
            name: 'req',
            direction: 'in',
            data: createHttpTrigger(
                'POST',
                'http://example.com/joboffers',
                {
                    "Authorization": `Bearer ${loginToken.id}`
                },
                {},
                body
            ),
        },
        { type: 'http', name: '$return', direction: 'out' }
    ]);

    await createUpdateJobOffer(context, context.req);

    return context.res;
}

const prepareCosmosDB = async () => {
    loginToken = {
        id: uuidv4(),
        email: "integrationuser",
        login_time: Date()
    }
    await loginAttemptsContainer.items.create(loginToken);
}

const cleanUpCosmosDB = async () => {
    await loginAttemptsContainer.item(loginToken.id, loginToken.id).delete();
}