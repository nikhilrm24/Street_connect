const { pool } = require("../db");

async function getVendorOrders(vendorId) {
  try {
    const result = await pool.query(
      `SELECT
        o.order_id,
        o.customer_id,
        o.vendor_id,
        o.status,
        o.total_amount,
        o.delivery_type,
        o.delivery_address,
        o.created_at,
        u.name AS customer_name,
        u.email AS customer_email,
        COALESCE(
          json_agg(
            json_build_object(
              'order_item_id', oi.order_item_id,
              'product_id', oi.product_id,
              'product_name', p.product_name,
              'quantity', oi.quantity,
              'price', oi.price
            )
          ) FILTER (WHERE oi.order_item_id IS NOT NULL),
          '[]'::json
        ) AS items
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      LEFT JOIN order_items oi ON oi.order_id = o.order_id
      LEFT JOIN products p ON p.product_id = oi.product_id
      WHERE o.vendor_id = $1
      GROUP BY
        o.order_id,
        o.customer_id,
        o.vendor_id,
        o.status,
        o.total_amount,
        o.delivery_type,
        o.delivery_address,
        o.created_at,
        u.name,
        u.email
      ORDER BY o.created_at DESC`,
      [vendorId]
    );

    return result.rows;
  } catch (e) {
    throw e;
  }
}

async function updateOrderStatus(orderId, vendorId, status) {
  const result = await pool.query(
    `UPDATE orders
     SET status = $1
     WHERE order_id = $2
       AND vendor_id = $3
       AND (
         (status = 'pending' AND $1 IN ('accepted', 'cancelled'))
         OR (status = 'accepted' AND $1 = 'preparing')
         OR (status = 'preparing' AND $1 = 'ready')
         OR (status = 'ready' AND $1 = 'delivered')
       )
     RETURNING *`,
    [status, orderId, vendorId]
  );

  if (result.rows.length > 0) {
    return { order: result.rows[0] };
  }

  const existingOrder = await pool.query(
    `SELECT order_id, status
     FROM orders
     WHERE order_id = $1
       AND vendor_id = $2`,
    [orderId, vendorId]
  );

  if (existingOrder.rows.length === 0) {
    return { reason: "not_found" };
  }

  return {
    reason: "invalid_transition",
    currentStatus: existingOrder.rows[0].status
  };
}

module.exports = {
  getVendorOrders,
  updateOrderStatus
};