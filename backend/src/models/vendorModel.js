const {pool}=require("../db");

async function getAllVendors() {
    try{
        const result=await pool.query("select * from vendors ")
    return result.rows
    }catch(e){
        throw e;
    }
}
async function getVendorById(id) {
    try{
        const result=await pool.query("select * from vendors where vendor_id=$1",[id])
        return result.rows[0];
    }catch(e){
        throw e;
    }
}

async function getVendorProfile(id) {
    try{
        const result=await pool.query("select * from vendors where user_id=$1",[id])
        return result.rows[0];
    }catch(e){
        throw e;
    }
}
module.exports={getAllVendors,getVendorById,getVendorProfile};