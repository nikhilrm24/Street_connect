const { pool } = require("../db");

async function getAdminOverview() {
  const [counts, vendors, orders] = await Promise.all([
    pool.query(`SELECT
      (SELECT COUNT(*) FROM users) AS total_users,
      (SELECT COUNT(*) FROM vendors) AS total_vendors,
      (SELECT COUNT(*) FROM products) AS total_products,
      (SELECT COUNT(*) FROM orders) AS total_orders`),
    pool.query(`SELECT
      v.vendor_id,
      v.business_name,
      v.category,
      v.is_available,
      v.rating,
      u.email
     FROM vendors v
     LEFT JOIN users u ON u.id = v.user_id
     ORDER BY v.business_name ASC`),
    pool.query(`SELECT
      o.order_id,
      o.status,
      o.total_amount,
      o.created_at,
      v.business_name AS vendor_name,
      u.name AS customer_name
     FROM orders o
     LEFT JOIN vendors v ON v.vendor_id = o.vendor_id
     LEFT JOIN users u ON u.id = o.customer_id
     ORDER BY o.created_at DESC
     LIMIT 20`)
  ]);

  return {
    counts: counts.rows[0],
    vendors: vendors.rows,
    orders: orders.rows
  };
}

module.exports = { getAdminOverview };