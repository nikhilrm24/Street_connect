const { getAllVendors } = require("../models/vendorModel");
const AppError = require("../utils/AppError");

async function getVendors(req,res,next) {
    
    try{
        const vendors=await getAllVendors();

        res.status(200).json({success:true,vendors});
    }catch(e){
        next(e);
    }

}

module.exports={getVendors};