import { FakeCityChicago, FakeCityNYC } from "../../mock_data/MockCities"
import { HighCompensationJobOffer, LowCompensationJobOffer } from "../../mock_data/MockJobOffers"
import { FakeUserDracula } from "../../mock_data/MockUsers"
import { JobOfferComparison } from "../../types/object_transfer_types"
import { createOfferComparison } from "../createJobOfferComparison"

const lowCompToLowCompComparisonInChicagoForDracula: JobOfferComparison = {
    offer1ID: "1",
    offer2ID: "1",
    offer1TotalCompensation: 41000,
    offer2TotalCompensation: 41000,
    offer1TotalCompensationWithLivingCosts: 40880,
    offer2TotalCompensationWithLivingCosts: 40880,
    offer1CityDemographicMatch: false,
    offer2CityDemographicMatch: false,
    offer1SalaryMatch: false,
    offer2SalaryMatch: false,
    offer1TemperatureMatch: false,
    offer2TemperatureMatch: false,
}

const highCompToHighCompComparisonInNYCForDracula: JobOfferComparison = {
    offer1ID: "2",
    offer2ID: "2",
    offer1TotalCompensation: 325000,
    offer2TotalCompensation: 325000,
    offer1TotalCompensationWithLivingCosts: 324688,
    offer2TotalCompensationWithLivingCosts: 324688,
    offer1CityDemographicMatch: true,
    offer2CityDemographicMatch: true,
    offer1SalaryMatch: true,
    offer2SalaryMatch: true,
    offer1TemperatureMatch: true,
    offer2TemperatureMatch: true,
}

const lowCompToHighCompComparisonInChicagoAndNYCForDracula: JobOfferComparison = {
    offer1ID: "1",
    offer2ID: "2",
    offer1TotalCompensation: 41000,
    offer2TotalCompensation: 325000,
    offer1TotalCompensationWithLivingCosts: 40880,
    offer2TotalCompensationWithLivingCosts: 324688,
    offer1CityDemographicMatch: false,
    offer2CityDemographicMatch: true,
    offer1SalaryMatch: false,
    offer2SalaryMatch: true,
    offer1TemperatureMatch: false,
    offer2TemperatureMatch: true,
}

describe('CompareJobOffers tests', () => {
    it('Correctly computes compensation, both cities false demographic match, both offers false salary match, both offers false temp match', () => {
        const actualComparison = createOfferComparison(LowCompensationJobOffer, LowCompensationJobOffer, FakeCityChicago, FakeCityChicago, FakeUserDracula);

        expect(actualComparison).toEqual(lowCompToLowCompComparisonInChicagoForDracula);
    }), 
    
    it('Correctly computes compensation, both cities true demographic match, both offers true salary match , both offers true temp match', () => {
        const actualComparison = createOfferComparison(HighCompensationJobOffer, HighCompensationJobOffer, FakeCityNYC, FakeCityNYC, FakeUserDracula);

        expect(actualComparison).toEqual(highCompToHighCompComparisonInNYCForDracula);
    }),

    it('Correctly computes compensation, one city true demographic match, one offer true salary match, one offer true temp match', () => {
        const actualComparison = createOfferComparison(LowCompensationJobOffer, HighCompensationJobOffer, FakeCityChicago, FakeCityNYC, FakeUserDracula);

        expect(actualComparison).toEqual(lowCompToHighCompComparisonInChicagoAndNYCForDracula);
    })
})