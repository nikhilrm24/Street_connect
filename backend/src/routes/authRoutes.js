const express=require("express");
const router=express.Router();
const {addUser, login, profile}=require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/auth/register",addUser);
router.post("/auth/login",login);
router.get("/auth/test",verifyToken,profile);

module.exports=router;