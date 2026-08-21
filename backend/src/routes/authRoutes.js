const express=require("express");
const router=express.Router();
const {addUser, login}=require("../controllers/authController")

router.post("/auth/register",addUser);
router.post("/auth/login",login);

module.exports=router;