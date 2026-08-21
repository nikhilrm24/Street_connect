const express=require("express");
const router=express.Router();
const {addUser, login, profile}=require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/auth/register",addUser);
router.post("/auth/login",login);


module.exports=router;