const { pool } = require("../db");

async function getVendorOrders(vendorId) {
  try {
    const tableCheck = await pool.query(
      `SELECT to_regclass('public.order_items') AS order_items_exists`
    );

    const hasOrderItemsTable = Boolean(tableCheck.rows[0]?.order_items_exists);

    if (!hasOrderItemsTable) {
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
          '[]'::json AS items
        FROM orders o
        JOIN users u ON o.customer_id = u.id
        WHERE o.vendor_id = $1
        ORDER BY o.created_at DESC`,
        [vendorId]
      );

      return result.rows;
    }

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

async function getVendorSalesSummary(vendorId) {
  try {
    const result = await pool.query(
      `SELECT
        COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) AS today_orders,
        COUNT(*) FILTER (WHERE status = 'delivered') AS completed_orders,
        COALESCE(
          SUM(CASE WHEN DATE(created_at) = CURRENT_DATE AND status = 'delivered' THEN total_amount ELSE 0 END),
          0
        ) AS today_sales,
        COALESCE(
          SUM(CASE WHEN status = 'delivered' THEN total_amount ELSE 0 END),
          0
        ) AS total_sales
      FROM orders
      WHERE vendor_id = $1`,
      [vendorId]
    );

    return result.rows[0] || {
      today_orders: 0,
      completed_orders: 0,
      today_sales: 0,
      total_sales: 0
    };
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
  getVendorSalesSummary,
  updateOrderStatus
};