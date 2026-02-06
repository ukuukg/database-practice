const fs=require("fs");
const qs=require("querystring");
const dotenv=require('dotenv');
const { Client } = require('pg');

dotenv.config(); 

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }  // Supabase 一定要
});

async function main() {
  let result;
  await client.connect();

  result = await client.query(`
      DROP TABLE student         
    `
  );
  console.log(result.rows);

  await client.end();
}

main().catch(console.error)

