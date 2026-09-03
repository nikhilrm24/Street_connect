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

module.exports = { getProductsByVendor };