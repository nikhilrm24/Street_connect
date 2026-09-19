const AppError = require("../utils/AppError");
const jwt=require("jsonwebtoken");
require("dotenv").config();

function verifyToken(req,res,next){
    try{
    const authHeader=req.headers.authorization;
     if(!authHeader || !authHeader.startsWith("Bearer ")){
         throw new AppError("Bearer token required",401); 
    }
     const token=authHeader.slice("Bearer ".length).trim();
     if (!token) {
         throw new AppError("Bearer token required",401);
     }
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    req.user=decoded;
    next();

    }catch(e){
        next(e);
    }
}
module.exports=verifyToken;