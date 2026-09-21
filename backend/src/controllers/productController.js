const { pool } = require("../db");
const { getProductsByVendor,getProductById, deleteProduct,getVendorProducts ,addProduct} = require("../models/productModel");
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

async function insertProduct(req, res, next) {

    try {

        const userId = req.user.id;

        const vendorResult = await pool.query(
            `SELECT vendor_id
             FROM vendors
             WHERE user_id = $1`,
            [userId]
        );

        if (vendorResult.rows.length === 0) {
            throw new AppError("Vendor not found");
        }

        const vendorId = vendorResult.rows[0].vendor_id;

        const {
            category_id,
            product_name,
            description,
            price,
            stock
        } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const product = await addProduct(
            vendorId,
            category_id,
            product_name,
            description,
            price,
            stock,
            imageUrl
        );

        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product
        });

    } catch (e) {
        next(e);
    }
}

async function getVendorProductsController(req, res, next) {
    try {
        const userId = req.user.id;

       
        const vendorResult = await pool.query(
            "SELECT vendor_id FROM vendors WHERE user_id = $1",
            [userId]
        );

        if (vendorResult.rows.length === 0) {
            throw new AppError("Vendor not found");
        }

        const vendorId = vendorResult.rows[0].vendor_id;

        const products = await getVendorProducts(vendorId);

        res.status(200).json({
            success: true,
            products
        });

    } catch (e) {
        next(e);
    }
}
async function updateProductController(req, res, next) {
    const { id } = req.params;

    const {
        category_id,
        product_name,
        description,
        price,
        stock
    } = req.body;

    try {
        const userId = req.user.id;

        
        const vendorResult = await pool.query(
            "SELECT vendor_id FROM vendors WHERE user_id = $1",
            [userId]
        );

        if (vendorResult.rows.length === 0) {
            throw new AppError("Vendor not found");
        }

        const vendorId = vendorResult.rows[0].vendor_id;

        const product = await updateProduct(
            id,
            vendorId,
            category_id,
            product_name,
            description,
            price,
            stock
        );

        if (!product) {
            throw new AppError("Product not found");
        }

        res.status(200).json({
            success: true,
            message: "Successfully updated",
            product
        });

    } catch (e) {
        next(e);
    }
}
async function deleteProductController(req, res, next) {

    try {

        const userId = req.user.id;
        const { id } = req.params;

        const vendorRes = await pool.query(
            `SELECT vendor_id
             FROM vendors
             WHERE user_id = $1`,
            [userId]
        );

        if (vendorRes.rows.length === 0) {
            throw new AppError("Vendor not found");
        }

        const vendorId = vendorRes.rows[0].vendor_id;

        const product = await deleteProduct(vendorId, id);

        if (!product) {
            throw new AppError("Product not found");
        }

        res.status(200).json({
            success: true,
            message: "Successfully deleted",
            product
        });

    } catch (e) {
        next(e);
    }
}
module.exports={getProducts,getProduct,insertProduct,getVendorProductsController,updateProductController,deleteProductController};