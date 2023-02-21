// Cities

export interface CityDemographics {
    id: string,
    total_population: number,
    caucasian_population: number,
    black_population: number,
    native_american_population: number,
    asian_population: number,
    pacific_islander_population: number,
    hispanic_population: number,
    population_under_25: number,
    population_25_to_29: number,
    population_30_to_34: number,
    population_35_to_44: number,
    population_45_to_54: number,
    population_55_to_64: number,
    population_65_to_74: number,
    population_75_and_older: number,
    male_population: number,
    female_population: number
}

export interface BasicCityInfo {
    id: string,
    name: string,
    state_id: string
}

// State
export interface BasicStateInfo {
    id: string,
    name: string
}

export interface StateTaxInfo {
    id: string,
    state_tax_rate: number,
    avg_local_tax_rate: number,
    combined_rate: number,
    max_local_tax_rate: number
}

export interface BasicUserInfo{
    id: string,
}