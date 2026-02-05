const http=require("http");
const fs=require("fs");
const qs=require("querystring");
const ip="0.0.0.0";
const dotenv=require('dotenv');
const PORT = process.env.PORT || 3000;
const { Client } = require('pg');

dotenv.config(); 
//如果有.env檔(例如本地端)，dotenv.config() 會讀.env檔並存到process.env
//如果沒有.env檔(例如render deploy端)，dotenv.config() 甚麼都不會做


const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }  // Supabase 一定要
});

async function main() {
  let result;
  await client.connect();

  /*result = await client.query(`
      CREATE TABLE IF NOT EXISTS key_value_pair (
        id SERIAL PRIMARY KEY,
        key TEXT,
        value TEXT
      );
    `
  );
  console.log(result.rows);*/

  /*result = await client.query('DROP TABLE IF EXISTS test;');
  console.log(result.rows);*/

  /*result = await client.query(
    'SELECT * FROM test WHERE apple IN ($1,$2,$3)',
    ['ww','www','wwww']
  );
  console.log(result.rows);*/

  /*result = await client.query(
    'INSERT INTO 記事本 (內容,備註) VALUES ($1,$2) RETURNING *',
    ['吃飯','eat']
  );
  console.log(result.rows);*/

  /*result = await client.query(
    'UPDATE test SET apple = $1 , frog = $2 WHERE id <= $3 RETURNING *',
    ['fxxk',400,3]
  );
  console.log(result.rows);*/

  /*result = await client.query(
    'DELETE FROM test WHERE frog = $1 RETURNING *',
    [9]
  );
  console.log(result.rows);*/

  await client.end();
}

main().catch(console.error)





/*const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  if (req.url === '/') {
    res.end('dog');
  } else if (req.url === '/frog') {
    res.end('frog');
  } else {
    res.end('Page not found');
  }
});


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log(process.env.password);*/
