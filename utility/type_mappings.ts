import { City, Company, CompanyReview, JobOffer, State, User } from "../types/database_types";
import { BasicCityInfo, BasicCompanyInfo, BasicCompanyReview, BasicStateInfo, BasicUserInfo, CityDetails, CompanyDetails, JobOfferDetails, StateDetails, UserInfo } from "../types/object_transfer_types";

export const cityToCityDetails = (city: City): CityDetails => {
    return {
        id: city.id,
        name: city.name,
        average_rent: city.average_rent,
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
        female_population: city.female_population,
        avg_temp_jan: city.avg_temp_jan,
        avg_temp_feb: city.avg_temp_feb,
        avg_temp_march: city.avg_temp_march,
        avg_temp_april: city.avg_temp_april,
        avg_temp_may: city.avg_temp_may,
        avg_temp_june: city.avg_temp_june,
        avg_temp_july: city.avg_temp_july,
        avg_temp_aug: city.avg_temp_aug,
        avg_temp_sept: city.avg_temp_sept,
        avg_temp_oct: city.avg_temp_oct,
        avg_temp_nov: city.avg_temp_nov,
        avg_temp_dec: city.avg_temp_dec,
        average_groceries_cost: city.average_groceries_cost
    }
}

export const cityToBasicCityInfo = (city: City): BasicCityInfo => {
    return {
        id: city.id,
        name: city.name,
        state_id: city.state_id
    }
}

export const stateToBasicStateInfo = (state: State): BasicStateInfo => {
    return {
        id: state.id,
        name: state.name
    }
}

export const stateToStateDetails = (state: State): StateDetails => {
    return {
        id: state.id,
        state_tax_rate: state.state_tax_rate,
        avg_local_tax_rate: state.avg_local_tax_rate,
        combined_rate: state.combined_rate,
        max_local_tax_rate: state.max_local_tax_rate,
        avg_internet_cost_permb: state.avg_internet_cost_permb,
        internet_rank: state.internet_rank,
        fiber_optic_service_percent: state.fiber_optic_service_percent,
        RTT_score: state.RTT_score,
        median_download_speed: state.median_download_speed,
        download_score: state.download_score,
        median_upload_speed: state.median_upload_speed
    }
}

export const userToBasicUserInfo = (user: User): BasicUserInfo => {
    return {
        id: user.id
    }
}

export const userToUserInfo = (user: User): UserInfo => {
    return {
        id: user.id,
        degree: user.degree,
        gender: user.gender,
        race: user.race,
        temperature_preference: user.temperature_preference,
        humidity_preference: user.humidity_preference,
        sunlight_preference: user.sunlight_preference,
        demographic_preference: user.demographic_preference,
        salary_preference: user.salary_preference,
        pto_preference: user.pto_preference,
        spender_type: user.spender_type
    }
}

export const companyToBasicCompanyInfo = (company: Company): BasicCompanyInfo => {
    return {
        id: company.id,
        name: company.name
    }
}

export const companyToCompanyDetails = (company: Company): CompanyDetails => {
    return {
        id: company.id,
        name: company.name
    }
}

export const companyReviewToBasicCompanyReviewInfo = (companyReview: CompanyReview): BasicCompanyReview => {
    return {
        id: companyReview.id,
        user_id: companyReview.is_anonymous ? null : companyReview.user_id,
        overall_rating: companyReview.overall_rating,
        comment: companyReview.comment
    }
}

export const jobOfferToJobOfferDetails = (jobOffer: JobOffer): JobOfferDetails => {
    return {
        id: jobOffer.id,
        user_id: jobOffer.user_id,
        RSU: jobOffer.RSU,
        signing_bonus: jobOffer.signing_bonus,
        relocation_bonus: jobOffer.relocation_bonus,
        salary: jobOffer.salary,
        title: jobOffer.title,
        company: jobOffer.company,
        city_id: jobOffer.city_id,
        state_id: jobOffer.state_id
    }
}