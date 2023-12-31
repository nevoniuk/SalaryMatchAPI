// Cities
export interface CityDetails {
    id: string,
    name: string,
    average_rent: number,
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
    female_population: number,
    avg_temp_jan: number,
    avg_temp_feb: number,
    avg_temp_march: number,
    avg_temp_april: number,
    avg_temp_may: number,
    avg_temp_june: number,
    avg_temp_july: number,
    avg_temp_aug: number,
    avg_temp_sept: number,
    avg_temp_oct: number,
    avg_temp_nov: number,
    avg_temp_dec: number,
    average_groceries_cost: number,
    average_utility_cost: number,
    average_electricity_cost: number,
    average_gas_cost: number,
    average_trash_cost: number,
    average_water_cost: number,
    state_abortion_laws: string,
    state_cannabis_legality: string,
    crime_rate_per_1000: number,
    state_school_score: number,
    restaurant_rating: number,
    food_ranking: number,
}

export interface BasicCityInfo {
    id: string,
    name: string,
    state_id: string
}

// States
export interface BasicStateInfo {
    id: string,
    name: string
}

export interface StateDetails {
    id: string,
    name: string,
    state_tax_rate: number,
    avg_local_tax_rate: number,
    combined_rate: number,
    max_local_tax_rate: number,
    avg_internet_cost_permb: number,
    internet_rank: number,
    fiber_optic_service_percent: number,
    RTT_score: number
    median_download_speed: number,
    download_score: number,
    median_upload_speed: number
}

// Users
export interface BasicUserInfo {
    id: string
}

export interface UserInfo {
    id: string,
    degree: string,
    gender: string,
    race: string,
    temperature_preference: string,
    humidity_preference: string,
    sunlight_preference: string,
    demographic_preference: string,
    salary_preference: string,
    pto_preference: string,
    spender_type: string
}

// Companies
export interface BasicCompanyInfo {
    id: string,
    name: string
}

export interface CompanyDetails {
    id: string,
    ticker: string,
    name: string,
    percent_male: number,
    percent_female: number,
    percent_caucasian: number,
    percent_asian: number,
    percent_latino: number,
    percent_black: number
}

export interface BasicCompanyReview {
    id: string,
    user_id: string,
    overall_rating: number,
    comment: string
}

export interface BasicCityReview {
    id: string,
    user_id: string,
    overall_rating: number,
    comment: string
}

// Job Offers
export interface JobOfferDetails {
    id: string,
    user_id: string,
    RSU: number,
    signing_bonus: number,
    relocation_bonus: number,
    salary: number,
    title: string,
    company: string,
    city_id: string,
    state_id: string
}

export interface JobOfferComparison {
    offer1ID: string,
    offer2ID: string,
    offer1TotalCompensation: number,
    offer2TotalCompensation: number,
    offer1TotalCompensationWithLivingCosts: number,
    offer2TotalCompensationWithLivingCosts: number,
    offer1TemperatureMatch?: boolean,
    offer2TemperatureMatch?: boolean,
    offer1CityDemographicMatch?: boolean,
    offer2CityDemographicMatch?: boolean,
    offer1SalaryMatch?: boolean,
    offer2SalaryMatch?: boolean,
}

export interface JobOfferAggregateComparison {
    sameCityAvgTotalCompensation: number,
    sameCompanyAvgTotalCompensation: number,
    sameCityAvgTotalCompensationWithLivingCosts: number,
    sameCompanyAvgTotalCompensationWithLivingCosts: number,
}