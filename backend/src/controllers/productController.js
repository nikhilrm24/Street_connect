const { getProductsByVendor } = require("../models/productModel");

async function getProducts(req,res,next) {
    const {id}=req.params;
    try{
        const products=await getProductsByVendor(id);
        res.status(200).json({success:true,products});
    }catch(e){
        next(e);
    }

}
module.exports={getProducts};