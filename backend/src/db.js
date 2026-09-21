const {Pool} =require("pg");
require('dotenv').config();

const pool=new Pool({
    user:process.env.DB_USER,
    host:process.env.DB_HOST,
    database:process.env.DB_NAME,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT

})

async function ensureProductImageColumn() {
    await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT`);
}

module.exports={pool, ensureProductImageColumn};