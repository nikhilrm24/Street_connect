const AppError = require("../utils/AppError");
const jwt=require("jsonwebtoken");
require("dotenv").config();

function verifyToken(req,res,next){
    try{
    const authHeader=req.headers.authorization;
    if(!authHeader){
       throw new AppError("auth header not found",404); 
    }
    const token=authHeader.split(" ")[1];
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    req.user=decoded;
    next();

    }catch(e){
        next(e);
    }
}
module.exports=verifyToken;