const { pool } = require("../db");

async function getProductsByVendor(vendorId) {
    try {
        const result = await pool.query(
            "SELECT * FROM products WHERE vendor_id = $1",
            [vendorId]
        );

        return result.rows;
    } catch (e) {
        throw e;
    }
}
async function getProductById(productId) {
    try {
        const result = await pool.query(
            "SELECT * FROM products WHERE product_id = $1",
            [productId]
        );

        return result.rows[0];
    } catch (e) {
        throw e;
    }
}

async function addProduct(
    vendorId,
    category_id,
    product_name,
    description,
    price,
    stock
) {
    try {
        const result = await pool.query(
            `INSERT INTO products
            (vendor_id, category_id, product_name, description, price, stock)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [vendorId, category_id, product_name, description, price, stock]
        );

        return result.rows[0];
    } catch (e) {
        throw e;
    }
}

async function getVendorProducts(vendorId) {
    try {
        const result = await pool.query(
            `SELECT * FROM products
             WHERE vendor_id = $1`,
            [vendorId]
        );

        return result.rows;
    } catch (e) {
        throw e;
    }
}
async function updateProduct(
    productId,
    vendorId,
    category_id,
    product_name,
    description,
    price,
    stock
) {
    try {
        const result = await pool.query(
            `UPDATE products SET
                category_id = $1,
                product_name = $2,
                description = $3,
                price = $4,
                stock = $5
             WHERE product_id = $6
             AND vendor_id = $7
             RETURNING *`,
            [
                category_id,
                product_name,
                description,
                price,
                stock,
                productId,
                vendorId
            ]
        );

        return result.rows[0];
    } catch (e) {
        throw e;
    }
}


module.exports = { getProductsByVendor,getProductById,addProduct,getVendorProducts,updateProduct};