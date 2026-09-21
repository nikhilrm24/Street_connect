
const { pool } = require("../db");
async function getAllVendors() {
    try{
        const result=await pool.query(`SELECT *, COALESCE(is_available, true) AS is_available FROM vendors`)
    return result.rows
    }catch(e){
        throw e;
    }
}
async function getVendorById(id) {
    try{
        const result=await pool.query(`SELECT *, COALESCE(is_available, true) AS is_available FROM vendors where vendor_id=$1`,[id])
        return result.rows[0];
    }catch(e){
        throw e;
    }
}

async function getVendorProfile(id) {
    try{
        const result=await pool.query(`SELECT *, COALESCE(is_available, true) AS is_available FROM vendors where user_id=$1`,[id])
        return result.rows[0];
    }catch(e){
        throw e;
    }
}
async function updateVendorProfile(
    id,
    business_name,
    category,
    phone,
    location_info,
    delivary_info,
    shop_image
){
    try{
        const result = await pool.query(
    `UPDATE vendors
     SET business_name = $1,
         category = $2,
         phone = $3,
         location_info = $4,
         delivary_info = $5,
         shop_image = $6
     WHERE user_id = $7
     RETURNING *, COALESCE(is_available, true) AS is_available`,
    [
        business_name,
        category,
        phone,
        location_info,
        delivary_info,
        shop_image,
        id
    ]
);

            return result.rows[0];
    }catch(e){
        throw e;
    }
}

async function updateVendorAvailability(vendorId, isAvailable) {
  try {
    const result = await pool.query(
      `UPDATE vendors
       SET is_available = $1
       WHERE vendor_id = $2
       RETURNING *, COALESCE(is_available, true) AS is_available`,
      [isAvailable, vendorId]
    );

    return result.rows[0];
  } catch (e) {
    throw e;
  }
}
async function getVendorLocation(vendorId) {
    try {
        const result = await pool.query(
            `SELECT * FROM vendor_locations
             WHERE vendor_id = $1`,
            [vendorId]
        );

        return result.rows[0];
    } catch (e) {
        throw e;
    }
}
async function updateVendorLocation(vendorId, latitude, longitude) {
  try {
    const result = await pool.query(
      `INSERT INTO vendor_locations
       (vendor_id, latitude, longitude)
       VALUES ($1, $2, $3)
       ON CONFLICT (vendor_id)
       DO UPDATE SET
         latitude = EXCLUDED.latitude,
         longitude = EXCLUDED.longitude,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [vendorId, latitude, longitude]
    );

    return result.rows[0];
  } catch (e) {
    throw e;
  }
}
async function createVendor(
  userId,
  business_name,
  category,
  phone,
  location_info,
  delivary_info,
  shop_image
) {
  try {
    const result = await pool.query(
      `INSERT INTO vendors
      (
        user_id,
        business_name,
        category,
        phone,
        location_info,
        delivary_info,
        shop_image
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        userId,
        business_name,
        category,
        phone,
        location_info,
        delivary_info,
        shop_image
      ]
    );

    return result.rows[0];

  } catch (e) {
    throw e;
  }
}
async function getAllVendorLocations() {
    try {
        const result = await pool.query(
            `SELECT * FROM vendor_locations`
        );

        return result.rows;
    } catch (e) {
        throw e;
    }
}

async function deleteVendor(vendorId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM vendor_locations WHERE vendor_id = $1", [vendorId]);
    await client.query("DELETE FROM products WHERE vendor_id = $1", [vendorId]);
    await client.query("UPDATE orders SET vendor_id = NULL WHERE vendor_id = $1", [vendorId]);

    const result = await client.query(
      "DELETE FROM vendors WHERE vendor_id = $1 RETURNING vendor_id",
      [vendorId]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
module.exports = {
    getAllVendors,
    getVendorById,
    getVendorProfile,
    updateVendorProfile,
    updateVendorAvailability,
    getVendorLocation,
    updateVendorLocation,
    getAllVendorLocations,
    createVendor,
    deleteVendor
};