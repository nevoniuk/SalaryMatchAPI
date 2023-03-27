export interface City {
    id: string,
    name: string,
    state_id: string,
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
    average_utility_cost: number
}

export interface State {
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

export interface User {
    id: string,
    password: string,
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

export interface JobOffer {
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

export interface Company {
    id: string,
    name: string
}

export interface CompanyReview {
    id: string,
    user_id: string,
    is_anonymous: boolean,
    company_id: string,
    overall_rating: number,
    comment: string
}

export interface UserFeedback {
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    message: string
}