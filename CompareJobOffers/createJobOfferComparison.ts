import { City, JobOffer, User } from "../types/database_types";
import { JobOfferComparison } from "../types/object_transfer_types";

export const createOfferComparison = (offer1: JobOffer, offer2: JobOffer, city1: City, city2: City, user: User): JobOfferComparison => {
    let offer1SalaryMatch = false;
    let offer2SalaryMatch = false;

    switch (user.salary_preference) {
        case "Over 50,000":
            offer1SalaryMatch = offer1.salary > 50000;
            offer2SalaryMatch = offer2.salary > 50000;
            break;
        case "Over 100,000":
            offer1SalaryMatch = offer1.salary > 100000;
            offer2SalaryMatch = offer2.salary > 100000;
            break;
        case "Over 200,000":
            offer1SalaryMatch = offer1.salary > 200000;
            offer2SalaryMatch = offer2.salary > 200000;
            break;
    }
    
    let offerComparison: JobOfferComparison = {
        offer1ID: offer1.id,
        offer1TotalCompensation: offer1.salary + offer1.RSU + offer1.relocation_bonus + offer1.signing_bonus,
        offer1TotalCompensationWithLivingCosts: offer1.salary + offer1.RSU + offer1.relocation_bonus + offer1.signing_bonus, // TODO
        offer1SalaryMatch: offer1SalaryMatch,

        offer2ID: offer2.id,
        offer2TotalCompensation: offer2.salary + offer2.RSU + offer2.relocation_bonus + offer2.signing_bonus,
        offer2TotalCompensationWithLivingCosts: offer2.salary + offer2.RSU + offer2.relocation_bonus + offer2.signing_bonus, // TODO
        offer2SalaryMatch: offer2SalaryMatch,
    }; 

    if (city1) {
        const city1PopulationDistribution = (city1.population_under_25 + city1.population_25_to_29) >= (city1.total_population * 0.5) ? "Young" : "Old";
        offerComparison = {
            ...offerComparison,
            offer1CityDemographicMatch: user.demographic_preference ? city1PopulationDistribution === user.demographic_preference : undefined,
        }
    }

    if (city2) {
        const city2PopulationDistribution = (city2.population_under_25 + city2.population_25_to_29) >= (city2.total_population * 0.5) ? "Young" : "Old";
        offerComparison = {
            ...offerComparison,
            offer2CityDemographicMatch: user.demographic_preference ? city2PopulationDistribution === user.demographic_preference : undefined,
        }
    }
    
    return offerComparison;
}