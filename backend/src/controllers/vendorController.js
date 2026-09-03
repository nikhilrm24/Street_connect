const { getAllVendors, getVendorById, getVendorProfile } = require("../models/vendorModel");
const AppError = require("../utils/AppError");

async function getVendors(req,res,next) {
    
    try{
        const vendors=await getAllVendors();
        res.status(200).json({success:true,vendors});
    }catch(e){
        next(e);
    }

}

async function getVendor(req,res,next) {
   const{id}=req.params;

    try{
         const vendor=await getVendorById(id);
         if(!vendor){
            throw new AppError("vendor not found");;
         }
         res.status(200).json({success:true,vendor})
    }catch(e){
        next(e);
    }
}

async function getProfile(req,res,next) {
   const id=req.user.id;

    try{
         const profile=await getVendorProfile(id);
         if(!profile){
            throw new AppError("vendor not found");;
         }
         res.status(200).json({success:true,profile})
    }catch(e){
        next(e);
    }
}
module.exports={getVendors,getVendor,getProfile};