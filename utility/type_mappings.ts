import { City } from "../types/database_types";
import { CityDemographics } from "../types/object_transfer_types";

export const cityToCityDemographics = (city: City): CityDemographics => {
    return {
        id: city.id,
        total_population: city.total_population,
        caucasian_population: city.caucasian_population,
        black_population: city.black_population,
        native_american_population: city.native_american_population,
        asian_population: city.asian_population,
        pacific_islander_population: city.pacific_islander_population,
        hispanic_population: city.hispanic_population,
        population_under_25: city.population_under_25,
        population_25_to_29: city.population_25_to_29,
        population_30_to_34: city.population_30_to_34,
        population_35_to_44: city.population_35_to_44,
        population_45_to_54: city.population_45_to_54,
        population_55_to_64: city.population_55_to_64,
        population_65_to_74: city.population_65_to_74,
        population_75_and_older: city.population_75_and_older,
        male_population: city.male_population,
        female_population: city.female_population
    }
}