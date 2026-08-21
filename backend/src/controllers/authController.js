const { createUser, findUserByEmail } = require("../models/userModel");
const bcrypt=require("bcrypt");
const AppError=require("../utils/AppError")
const jwt=require("jsonwebtoken");
require("dotenv").config();

async function addUser(req,res,next) {
    try{
        const{name,
          email,
          password,
          role
    }=req.body;

    const user=await createUser(name,email,password,role);
    if(!user){
       throw new AppError("user cannot be created",404);
    }
     res.status(201).json({message:"successfully created user"});
    }catch(e){
        next(e);
    }
    
}

async function login(req,res,next){
    try{
    const{email,password}=req.body;

    const user=await findUserByEmail(email);
    if(!user){
       throw new AppError("user not found",404);
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        throw new AppError("invalid password",403);
    }
    const token=jwt.sign({id:user.id,email:user.email},
                process.env.JWT_SECRET,{expiresIn:"1h"}
    )
    res.json({token});

    
    }catch(e){
        next(e);
    }

}
async function profile(req,res) {
    res.json("helo");
}

module.exports={addUser,login,profile};