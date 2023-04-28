import { Context } from "@azure/functions";
import { ChicagoAndNYCCityList } from "../../mock_data/MockCities";
import { HighCompensationJobOffer, LowAndHighCompensationJobOfferList, LowCompensationJobOffer } from "../../mock_data/MockJobOffers"
import { JobOffer } from "../../types/database_types";
import { createOfferAggregateComparison, findAvgJobOfferCompensation, findAvgJobOfferCompensationWithLivingCosts } from "../createJobOfferComparison"
import {
    stubContextFromBindingDefinitions,
    createHttpTrigger,
} from 'stub-azure-function-context';
import compareJobOfferToAggregates from "..";
import { jobOffersContainer } from "../../cosmosClient";
import { v4 as uuidv4 } from "uuid";
import { loginAttemptsContainer } from "../../cosmosClient";

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
    salary: 100000,
    title: "Fake Guy",
    company: "Fake Corp",
    city_id: "Fake City",
    state_id: "Fake"
}

const differentUserOffer: JobOffer = {
    ...fakeOffer,
    user_id: "fakeUser",
}

describe('CompareJobOfferToAggregates unit tests', () => {
    it('findAvgJobOfferCompensation averages total job offer compensation correctly', () => {
        expect(findAvgJobOfferCompensation(LowAndHighCompensationJobOfferList)).toEqual(183000);
    }),

    it('findAvgJobOfferCompensation averages total job offer compensation correctly when list is empty', () => {
        expect(findAvgJobOfferCompensation([])).toEqual(0);
    }),

    it('findAvgJobOfferCompensation averages total job offer compensation correctly when list has one element', () => {
        expect(findAvgJobOfferCompensation([LowCompensationJobOffer])).toEqual(41000);
    }),

    it('findAvgJobOfferCompensationWithLivingCosts averages total job offer compensation correctly without cities', () => {
        expect(findAvgJobOfferCompensationWithLivingCosts(LowAndHighCompensationJobOfferList, [])).toEqual(183000);
    }),

    it('findAvgJobOfferCompensationWithLivingCosts averages total job offer compensation correctly with cities', () => {
        expect(findAvgJobOfferCompensationWithLivingCosts(LowAndHighCompensationJobOfferList, ChicagoAndNYCCityList)).toEqual(182271.36);
    }),

    it('findAvgJobOfferCompensationWithLivingCosts averages total job offer compensation correctly when list is empty', () => {
        expect(findAvgJobOfferCompensationWithLivingCosts([], [])).toEqual(0);
    }),

    it('findAvgJobOfferCompensationWithLivingCosts averages total job offer compensation correctly when list has one element', () => {
        expect(findAvgJobOfferCompensationWithLivingCosts([LowCompensationJobOffer], ChicagoAndNYCCityList)).toEqual(40271.36);
    }),

    it('createOfferAggregateComparison creates aggregate offer comparison object correctly', () => {
        expect(createOfferAggregateComparison([LowCompensationJobOffer], [HighCompensationJobOffer], ChicagoAndNYCCityList)).toEqual({
            sameCityAvgTotalCompensation: 41000,
            sameCompanyAvgTotalCompensation: 325000,
            sameCityAvgTotalCompensationWithLivingCosts: 40271.36,
            sameCompanyAvgTotalCompensationWithLivingCosts: 324271.36
        });
    })
});

describe('CompareJobOfferToAggregates integration tests', () => {
    beforeAll(() => {
        return prepareCosmosDB();
    }),

    afterAll(() => {
        return cleanUpCosmosDB();
    }),

    it('Job offer does not exist', async () => {
        const response = await mockedRequestFactory(null);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual("\"Job offer does not exist.\"");
    }),

    it('User does not own job offer', async () => {
        const response = await mockedRequestFactory(differentUserOffer);
        expect(response.statusCode).toEqual(401);
        expect(response.body).toEqual("\"User does not have access to job offer.\"");
    }),

    it('Offer exists, but city and company do not', async () => {
        const response = await mockedRequestFactory(fakeOffer);
        const fakeOfferTotalComp = fakeOffer.salary + fakeOffer.RSU + fakeOffer.relocation_bonus + fakeOffer.signing_bonus;

        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual(JSON.stringify({
            sameCityAvgTotalCompensation: fakeOfferTotalComp,
            sameCompanyAvgTotalCompensation: fakeOfferTotalComp,
            sameCityAvgTotalCompensationWithLivingCosts: fakeOfferTotalComp,
            sameCompanyAvgTotalCompensationWithLivingCosts: fakeOfferTotalComp
        }));
    })
})

const mockedRequestFactory = async (offer: JobOffer) => {
    const context: Context = stubContextFromBindingDefinitions([
        {
            type: 'httpTrigger',
            name: 'req',
            direction: 'in',
            data: createHttpTrigger(
                'GET',
                'http://example.com/joboffer/{id}/aggregate',
                {
                    "Authorization": `Bearer ${loginToken.id}`
                }
            ),
        },
        { type: 'http', name: '$return', direction: 'out' }
    ]);

    await compareJobOfferToAggregates(context, context.req, offer);

    return context.res;
}

const prepareCosmosDB = async () => {
    loginToken = {
        id: uuidv4(),
        email: "integrationuser",
        login_time: Date()
    }
    await loginAttemptsContainer.items.create(loginToken);
    await jobOffersContainer.items.create(fakeOffer);
}

const cleanUpCosmosDB = async () => {
    await loginAttemptsContainer.item(loginToken.id, loginToken.id).delete();
    await jobOffersContainer.item(fakeOffer.id, fakeOffer.id).delete();
}