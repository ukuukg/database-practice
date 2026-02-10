// Import required modules
const fs = require("fs");           // File system module
const qs = require("querystring");  // Query string parsing
const dotenv = require('dotenv');   // Environment variables loader
const { Client } = require('pg');   // PostgreSQL client

// Load environment variables from .env file
dotenv.config();

// Create PostgreSQL client with connection details
const client = new Client({
  connectionString: process.env.DATABASE_URL,  // Database connection string
  ssl: { rejectUnauthorized: false }           // SSL configuration for Supabase
});

// Main function to execute database operations
async function main() {
  let result;

  // Connect to the database
  await client.connect();

  // Execute DELETE query to remove employee with ID 207
  result = await client.query(`
      DELETE FROM employee
      WHERE emp_id = 207;
    `
  );

  // Log the result of the query
  console.log(result.rows);

  // Close the database connection
  await client.end();
}

// Execute main function and handle any errors
main().catch(console.error);

