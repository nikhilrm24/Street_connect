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
async function updateVendorProfile(id,business_name,category,phone,location_info,delivary_info) {
    try{
        const result=await pool.query(`update vendors set 
            business_name=$1,
            category=$2,phone=$3,location_info=$4,delivary_info=$5
            where user_id=$6 returning *
            `,[business_name,category,phone,location_info,delivary_info,id])

            return result.rows[0];
    }catch(e){
        throw e;
    }
}
module.exports={getAllVendors,getVendorById,getVendorProfile,updateVendorProfile};