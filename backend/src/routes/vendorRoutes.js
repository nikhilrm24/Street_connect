const express=require("express");
const { getVendors, getVendor } = require("../controllers/vendorController");
const router=express.Router();


router.get("/vendors",getVendors);
router.get("/vendors/:id",getVendor);

module.exports=router;