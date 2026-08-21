const bcrypt=require("bcrypt");
const {pool}=require("../db");
require("dotenv").config();

async function createUser(name,email,password,role) {
    try{
    const h_password=await bcrypt.hash(password,10);
    const result=await pool.query(`insert into users(name,email,password,role)
        values($1,$2,$3,$4) returning *`,[name,email,h_password,role]);

    return result.rows[0];
    }catch(e){
        throw e;
    }
    
}

async function findUserByEmail(email) {
    try{
        const result=await pool.query(`select * from users where email=$1 `,[email]);

        return result.rows[0];
    }catch(e){
        throw e;
    }
    
}

module.exports={createUser,findUserByEmail};