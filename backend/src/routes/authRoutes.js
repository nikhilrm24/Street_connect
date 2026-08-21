const express=require("express");
const router=express.Router();
const {addUser}=require("../controllers/authController")

router.post("/auth/register",addUser);

module.exports=router;