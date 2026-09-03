const { getProductsByVendor,getProductById } = require("../models/productModel");
const AppError = require("../utils/AppError");

async function getProducts(req,res,next) {
    const {id}=req.params;
    try{
        const products=await getProductsByVendor(id);
        res.status(200).json({success:true,products});
    }catch(e){
        next(e);
    }

}

async function getProduct(req, res, next) {
    const { id } = req.params;

    try {
        const product = await getProductById(id);

        if (!product) {
            throw new AppError("Product not found");
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (e) {
        next(e);
    }
}
module.exports={getProducts,getProduct};