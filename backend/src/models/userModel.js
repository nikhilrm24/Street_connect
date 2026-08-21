const bcrypt=require("bcrypt");
const {pool}=require("../db");

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

module.exports={createUser};