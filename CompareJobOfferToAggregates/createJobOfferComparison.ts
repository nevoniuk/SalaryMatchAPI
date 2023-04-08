import { City, JobOffer } from "../types/database_types";
import { JobOfferAggregateComparison } from "../types/object_transfer_types";

export const createOfferAggregateComparison = (sameCityOffers: JobOffer[], sameCompanyOffers: JobOffer[], cities: City[]): JobOfferAggregateComparison => {
    return {
        sameCityAvgTotalCompensation: findAvgJobOfferCompensation(sameCityOffers),
        sameCompanyAvgTotalCompensation: findAvgJobOfferCompensation(sameCompanyOffers),
        sameCityAvgTotalCompensationWithLivingCosts: findAvgJobOfferCompensationWithLivingCosts(sameCityOffers, cities),
        sameCompanyAvgTotalCompensationWithLivingCosts: findAvgJobOfferCompensationWithLivingCosts(sameCompanyOffers, cities)
    }
}

const findAvgJobOfferCompensation = (offerList: JobOffer[]): number => {
    return offerList.reduce(
        (prev, current) => prev + current.salary + current.RSU + current.relocation_bonus + current.signing_bonus, 0.0) / offerList.length;
}

const findAvgJobOfferCompensationWithLivingCosts = (offerList: JobOffer[], cities: City[]): number => {
    return offerList.reduce(
        (prev, current) => {
            const offerCity = cities.find((city) => city.name === current.city_id);
            if (offerCity) {
                return prev + current.salary + current.RSU + current.relocation_bonus + current.signing_bonus -
                 12 * (offerCity.average_rent + offerCity.average_groceries_cost * 8 + offerCity.average_utility_cost)
            }
            return prev + current.salary + current.RSU + current.relocation_bonus + current.signing_bonus;
        },
         0.0) / offerList.length;
}