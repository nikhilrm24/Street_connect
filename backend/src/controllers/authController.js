const { createUser } = require("../models/userModel");
const AppError=require("../utils/AppError")
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

module.exports={addUser};