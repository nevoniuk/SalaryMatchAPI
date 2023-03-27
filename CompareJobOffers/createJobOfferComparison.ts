import { Context } from "@azure/functions";
import { City, JobOffer, User } from "../types/database_types";
import { JobOfferComparison } from "../types/object_transfer_types";

export const createOfferComparison = (context: Context, offer1: JobOffer, offer2: JobOffer, city1: City, city2: City, user: User): JobOfferComparison => {
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
        offer1TotalCompensationWithLivingCosts: offer1.salary + offer1.RSU + offer1.relocation_bonus + offer1.signing_bonus,
        offer1SalaryMatch: offer1SalaryMatch,

        offer2ID: offer2.id,
        offer2TotalCompensation: offer2.salary + offer2.RSU + offer2.relocation_bonus + offer2.signing_bonus,
        offer2TotalCompensationWithLivingCosts: offer2.salary + offer2.RSU + offer2.relocation_bonus + offer2.signing_bonus,
        offer2SalaryMatch: offer2SalaryMatch,
    }; 

    const avgTempUS = 54.4;

    if (city1) {
        const city1PopulationDistribution = (city1.population_under_25 + city1.population_25_to_29) >= (city1.total_population * 0.5) ? "Young" : "Old";
        const city1AvgTemp = [city1.avg_temp_jan + city1.avg_temp_feb + city1.avg_temp_march + city1.avg_temp_april + city1.avg_temp_may + city1.avg_temp_june 
            + city1.avg_temp_july + city1.avg_temp_aug + city1.avg_temp_sept + city1.avg_temp_oct + city1.avg_temp_nov + city1.avg_temp_dec]
            .reduce((total, current) => total + current) / 12;
        const city1TempType = city1AvgTemp <= 0.75 * avgTempUS ? "Cold" : city1AvgTemp <= avgTempUS ? "Mild" : "Hot";
        context.log(city1);
        offerComparison = {
            ...offerComparison,
            offer1TotalCompensationWithLivingCosts: offerComparison.offer1TotalCompensationWithLivingCosts - 12 * (city1.average_rent + city1.average_groceries_cost),
            offer1CityDemographicMatch: user.demographic_preference ? city1PopulationDistribution === user.demographic_preference : undefined,
            offer1TemperatureMatch: user.temperature_preference ? city1TempType === user.temperature_preference : undefined
        };
    }

    if (city2) {
        const city2PopulationDistribution = (city2.population_under_25 + city2.population_25_to_29) >= (city2.total_population * 0.5) ? "Young" : "Old";
        const city2AvgTemp = [city2.avg_temp_jan + city2.avg_temp_feb + city2.avg_temp_march + city2.avg_temp_april + city2.avg_temp_may + city2.avg_temp_june 
            + city2.avg_temp_july + city2.avg_temp_aug + city2.avg_temp_sept + city2.avg_temp_oct + city2.avg_temp_nov + city2.avg_temp_dec]
            .reduce((total, current) => total + current) / 12;
        const city2TempType = city2AvgTemp <= 0.75 * avgTempUS ? "Cold" : city2AvgTemp <= avgTempUS ? "Mild" : "Hot";
        context.log(city2);
        offerComparison = {
            ...offerComparison,
            offer2TotalCompensationWithLivingCosts: offerComparison.offer2TotalCompensationWithLivingCosts - 12 * (city2.average_rent + city2.average_groceries_cost),
            offer2CityDemographicMatch: user.demographic_preference ? city2PopulationDistribution === user.demographic_preference : undefined,
            offer2TemperatureMatch: user.temperature_preference ? city2TempType === user.temperature_preference : undefined
        }
    }
    
    return offerComparison;
}