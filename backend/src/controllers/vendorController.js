const { addProduct } = require("../models/productModel");
const { getAllVendors, getVendorById, getVendorProfile, updateVendorProfile } = require("../models/vendorModel");
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
async function UpdateVendor(req,res,next) {
    const id=req.user.id;
    const {business_name,category,phone,location_info,delivary_info}=req.body;

    try{
        const profile=await updateVendorProfile(id,business_name,category,phone,location_info,delivary_info);
        if(!profile){
            throw new AppError("cannot update user profile");
        }
        res.status(200).json({success:true,message:"successfully updated"})
    }catch(e){
        next(e);
    }
}
async function getLocation(req, res, next) {
    try {
        const userId = req.user.id;

        const vendorRes = await pool.query(
            `SELECT vendor_id FROM vendors
             WHERE user_id = $1`,
            [userId]
        );

        if (vendorRes.rows.length === 0) {
            throw new AppError("Vendor not found");
        }

        const vendorId = vendorRes.rows[0].vendor_id;

        const location = await getVendorLocation(vendorId);

        if (!location) {
            throw new AppError("Location not found");
        }

        res.status(200).json({
            success: true,
            location
        });

    } catch (e) {
        next(e);
    }
}
async function updateLocation(req, res, next) {
    try {
        const userId = req.user.id;

        const { latitude, longitude } = req.body;

        const vendorRes = await pool.query(
            `SELECT vendor_id FROM vendors
             WHERE user_id = $1`,
            [userId]
        );

        if (vendorRes.rows.length === 0) {
            throw new AppError("Vendor not found");
        }

        const vendorId = vendorRes.rows[0].vendor_id;

        const location = await updateVendorLocation(
            vendorId,
            latitude,
            longitude
        );

        if (!location) {
            throw new AppError("Location not found");
        }

        res.status(200).json({
            success: true,
            message: "Location successfully updated",
            location
        });

    } catch (e) {
        next(e);
    }
}

module.exports={getVendors,getVendor,getProfile,UpdateVendor,getLocation,updateLocation};