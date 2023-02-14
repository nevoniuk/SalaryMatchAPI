import { Container, Database } from '@azure/cosmos';

const cosmos = require('@azure/cosmos');
const { CosmosClient } = cosmos;

const client = new CosmosClient(process.env["CosmosDbConnectionString"]);
// All function invocations also reference the same database and container.
const database: Database = client.database("SalaryMatchDB");

const sampleContainer: Container = database.container("SampleContainer");

export {database, sampleContainer}