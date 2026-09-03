const { getAllCategory } = require("../models/categoryModel");

async function getCategory(req,res,next) {
    
    try{
        const category=await getAllCategory();
        res.status(200).json({success:true,category});
    }catch(e){
        next(e);
    }

}
module.exports={getCategory};