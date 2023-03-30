import { JobOffer } from "../types/database_types";

export const LowCompensationJobOffer: JobOffer = {
    id: "1",
    user_id: "1",
    RSU: 0,
    signing_bonus: 0,
    relocation_bonus: 1000,
    salary: 40000,
    title: "Code Monkey",
    company: "ABC Corp",
    city_id: "Chicago",
    state_id: "Illinois"
}

export const HighCompensationJobOffer: JobOffer = {
    id: "2",
    user_id: "1",
    RSU: 10000,
    signing_bonus: 10000,
    relocation_bonus: 5000,
    salary: 300000,
    title: "Big Monkey",
    company: "Google",
    city_id: "Chicago",
    state_id: "Illinois"
}