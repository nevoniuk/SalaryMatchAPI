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
    female_population: number
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

export interface BasicCompanyReview {
    id: string,
    user_id: string,
    overall_rating: number,
    comment: string
}