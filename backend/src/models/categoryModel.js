const {pool}=require("../db")
async function getAllCategory() {
    try{
        const result=await pool.query("select * from categories")
    return result.rows;
    }catch(e){
        throw e;
    }
}

module.exports={getAllCategory};