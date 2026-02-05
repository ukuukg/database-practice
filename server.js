const http=require("http");
const fs=require("fs");
const qs=require("querystring");
const ip="0.0.0.0";
const dotenv=require('dotenv');
const PORT = process.env.PORT || 3000;
const { Client } = require('pg');

dotenv.config(); 
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }  // Supabase 一定要
});
let mainpage=fs.readFileSync('mainpage.html');


async function connect_database(){
    let result;
    result = await client.connect();
    return result;
}

async function reconnect_database(){
    let result;
    await client.end();
    result = await client.connect();
    return result;
}

async function disconnect_database(){
    let result;
    result = await client.end();
    return result;
}

async function select_all() {
    let result;
    result = await client.query('SELECT * FROM 記事本 ');
    return result.rows;
}

async function getNotFound(res){
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Page not found');
}

async function getMainpage(res){
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(mainpage);
}

async function getSelectAll(res){
    res.writeHead(200, { 'Content-Type': 'text/json' });
    let result = await select_all();
    result = JSON.stringify(result) ;
    res.end(result);
}

async function create(res,content,note) {
    let result;
    result = await client.query(
        'INSERT INTO 記事本 (內容,備註) VALUES ($1,$2) RETURNING *',
        [content,note]
    );
    res.writeHead(200, { 'Content-Type': 'text/json' });
    res.end(JSON.stringify('success'));
}

async function update(res,id,content,note) {
    let result;
    result = await client.query(
        'UPDATE 記事本 SET 內容 = $1 , 備註 = $2 WHERE id = $3 RETURNING *',
        [content,note,id]
    );
    res.writeHead(200, { 'Content-Type': 'text/json' });
    if(result.length===0){
        res.end(JSON.stringify('fail'));
    }else{
        res.end(JSON.stringify('success'));
    }
    
}

async function del(res,id) {
    let result;
    result = await client.query(
        'DELETE FROM 記事本 WHERE id = $1 RETURNING *',
        [id]
    );
    res.writeHead(200, { 'Content-Type': 'text/json' });
    if(result.length===0){
        res.end(JSON.stringify('fail'));
    }else{
        res.end(JSON.stringify('success'));
    }
}

async function fail(res) {
    res.writeHead(200, { 'Content-Type': 'text/json' });
    res.end(JSON.stringify('fail'));
}





async function main() {
    let result;
    result = await connect_database();
    //console.log(result);

    const server = http.createServer((req, res) => {
        let method = req.method; // GET, POST, , ... 
        let url = req.url;
        if(method==='GET'){
            if (url === '/') {
                getMainpage(res);
            } else if (url === '/select_all') {
                getSelectAll(res);
            } else {
                url=url.split('/');
                if(url[1]==='create'){
                    if(url.length!=4){
                        fail(res);
                    }else{
                        create(res,url[2],url[3]);
                    }
                }else if(url[1]==='update'){
                    
                    if(url.length!=5){
                        fail(res);
                    }else{
                        update(res,parseInt(url[2]),url[3],url[4]);
                    }
                }else if(url[1]==='delete'){
                    if(url.length!=3){
                        fail(res);
                    }else{
                        del(res,parseInt(url[2]));
                    }
                }else{
                    getNotFound(res);
                }
            }
        } else{
            getNotFound(res);
        }

    });

    server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    });    
}

main();