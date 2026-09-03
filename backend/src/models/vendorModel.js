const {pool}=require("../db");

async function getAllVendors() {
    try{
        const result=await pool.query("select * from vendors ")
    return result.rows
    }catch(e){
        throw e;
    }
}

module.exports={getAllVendors};