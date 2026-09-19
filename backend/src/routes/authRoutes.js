const express=require("express");
const router=express.Router();
const {addUser, login, profile}=require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post(
  "/auth/register",
  upload.single("shop_image"),
  addUser
);

router.post("/auth/login",login);


module.exports=router;