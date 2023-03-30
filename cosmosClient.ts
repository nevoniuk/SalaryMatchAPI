import { Container, Database } from '@azure/cosmos';

const cosmos = require('@azure/cosmos');
const { CosmosClient } = cosmos;

const client = new CosmosClient(process.env["CosmosDbConnectionString"]);
// All function invocations also reference the same database and container.
export const database: Database = client.database("SalaryMatchDB");

export const sampleContainer: Container = database.container("SampleContainer");
export const statesContainer: Container = database.container("States");
export const usersContainer: Container = database.container("Users");
export const loginAttemptsContainer: Container = database.container("LoginAttempts");
export const companyReviewsContainer: Container = database.container("CompanyReviews");
export const cityReviewsContainer: Container = database.container("CityReviews");
export const jobOffersContainer: Container = database.container("JobOffers");