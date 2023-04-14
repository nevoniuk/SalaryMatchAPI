import { ChicagoAndNYCCityList } from "../../mock_data/MockCities";
import { HighCompensationJobOffer, LowAndHighCompensationJobOfferList, LowCompensationJobOffer } from "../../mock_data/MockJobOffers"
import { createOfferAggregateComparison, findAvgJobOfferCompensation, findAvgJobOfferCompensationWithLivingCosts } from "../createJobOfferComparison"


describe('CompareJobOffers tests', () => {
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
})