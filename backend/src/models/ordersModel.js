const { pool } = require("../db");

async function createCustomerOrders(customerId, items, deliveryType, deliveryAddress) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const groupedItems = new Map();
    for (const item of items) {
      const productId = Number(item.product_id);
      const quantity = Number(item.quantity);

      if (!Number.isInteger(productId) || !Number.isInteger(quantity) || quantity < 1) {
        throw new Error("Invalid cart item");
      }

      const productResult = await client.query(
        `SELECT p.product_id, p.vendor_id, p.price, p.stock, v.is_available
         FROM products p
         JOIN vendors v ON v.vendor_id = p.vendor_id
         WHERE p.product_id = $1
         FOR UPDATE OF p`,
        [productId]
      );

      const product = productResult.rows[0];
      if (!product) throw new Error("Product not found");
      if (!product.is_available) throw new Error("A vendor in your cart is currently closed");
      if (Number(product.stock) < quantity) throw new Error("A product has insufficient stock");

      const vendorItems = groupedItems.get(product.vendor_id) || [];
      vendorItems.push({ product, quantity });
      groupedItems.set(product.vendor_id, vendorItems);
    }

    const orders = [];
    for (const vendorItems of groupedItems.values()) {
      const total = vendorItems.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0
      );

      const orderResult = await client.query(
        `INSERT INTO orders
          (customer_id, vendor_id, status, total_amount, delivery_type, delivery_address)
         VALUES ($1, $2, 'pending', $3, $4, $5)
         RETURNING order_id, vendor_id, status, total_amount, delivery_type, delivery_address, created_at`,
        [customerId, vendorItems[0].product.vendor_id, total, deliveryType, deliveryAddress || null]
      );

      for (const item of vendorItems) {
        await client.query(
          `UPDATE products SET stock = stock - $1 WHERE product_id = $2`,
          [item.quantity, item.product.product_id]
        );
      }

      orders.push(orderResult.rows[0]);
    }

    await client.query("COMMIT");
    return orders;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function getCustomerOrders(customerId) {
  const result = await pool.query(
    `SELECT
      o.order_id,
      o.vendor_id,
      v.business_name AS vendor_name,
      o.status,
      o.total_amount,
      o.delivery_type,
      o.delivery_address,
      o.created_at
     FROM orders o
     LEFT JOIN vendors v ON v.vendor_id = o.vendor_id
     WHERE o.customer_id = $1
     ORDER BY o.created_at DESC`,
    [customerId]
  );

  return result.rows;
}

async function getCustomerNotifications(customerId) {
  const result = await pool.query(
    `SELECT
      o.order_id,
      o.status,
      o.total_amount,
      o.created_at,
      v.business_name AS vendor_name
     FROM orders o
     LEFT JOIN vendors v ON v.vendor_id = o.vendor_id
     WHERE o.customer_id = $1
     ORDER BY o.created_at DESC
     LIMIT 20`,
    [customerId]
  );

  return result.rows.map((order) => ({
    id: `customer-order-${order.order_id}-${order.status}`,
    order_id: order.order_id,
    title: order.status === "pending" ? "Order placed" : "Order update",
    message: order.status === "pending"
      ? `Your order #${order.order_id} was sent to ${order.vendor_name || "the vendor"}.`
      : `Order #${order.order_id} is now ${order.status}.`,
    status: order.status,
    total_amount: order.total_amount,
    created_at: order.created_at
  }));
}

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

async function getVendorNotifications(vendorId) {
  const result = await pool.query(
    `SELECT
      o.order_id,
      o.status,
      o.total_amount,
      o.created_at,
      u.name AS customer_name
     FROM orders o
     JOIN users u ON o.customer_id = u.id
     WHERE o.vendor_id = $1
     ORDER BY o.created_at DESC
     LIMIT 20`,
    [vendorId]
  );

  return result.rows.map((order) => ({
    id: `order-${order.order_id}-${order.status}`,
    order_id: order.order_id,
    type: order.status === "pending" ? "new_order" : "order_update",
    title: order.status === "pending" ? "New order received" : "Order status updated",
    message: `Order #${order.order_id} from ${order.customer_name || "a customer"} is ${order.status}.`,
    status: order.status,
    total_amount: order.total_amount,
    created_at: order.created_at,
    read: false
  }));
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
  createCustomerOrders,
  getCustomerOrders,
  getCustomerNotifications,
  getVendorOrders,
  getVendorSalesSummary,
  getVendorNotifications,
  updateOrderStatus
};