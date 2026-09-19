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
        if (e.name === "TokenExpiredError" || e.name === "JsonWebTokenError") {
            return next(new AppError("Invalid or expired token", 401));
        }
        next(e);
    }
}
module.exports=verifyToken;