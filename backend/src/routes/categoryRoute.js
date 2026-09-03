const express=require("express");
const { getCategory } = require("../controllers/categoryController");
const router=express.Router();

router.get("/categories",getCategory);

module.exports=router;