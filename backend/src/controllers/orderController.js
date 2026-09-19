const {
  createCustomerOrders,
  getCustomerOrders,
  getCustomerNotifications,
  getVendorOrders,
  getVendorSalesSummary,
  getVendorNotifications,
  updateOrderStatus
} = require("../models/ordersModel");

const { pool } = require("../db");
const AppError = require("../utils/AppError");

async function createCustomerOrdersController(req, res, next) {
  try {
    const { items, delivery_type, delivery_address } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      throw new AppError("Cart is empty", 400);
    }

    if (!["pickup", "delivery"].includes(delivery_type)) {
      throw new AppError("Invalid delivery type", 400);
    }

    if (delivery_type === "delivery" && !String(delivery_address || "").trim()) {
      throw new AppError("Delivery address is required", 400);
    }

    const orders = await createCustomerOrders(
      req.user.id,
      items,
      delivery_type,
      String(delivery_address || "").trim()
    );

    res.status(201).json({ success: true, orders });
  } catch (error) {
    if (error.message === "Cart is empty" || error.message === "Invalid cart item" || error.message === "Product not found" || error.message.includes("vendor") || error.message.includes("stock")) {
      return next(new AppError(error.message, 400));
    }
    next(error);
  }
}

async function getVendorOrdersController(req, res, next) {
  try {
    const userId = req.user.id;

    
    const vendorResult = await pool.query(
      `SELECT vendor_id
       FROM vendors
       WHERE user_id = $1`,
      [userId]
    );

    if (vendorResult.rows.length === 0) {
      throw new AppError("Vendor not found", 404);
    }

    const vendorId = vendorResult.rows[0].vendor_id;

    const orders = await getVendorOrders(vendorId);

    res.status(200).json({
      success: true,
      orders
    });

  } catch (e) {
    next(e);
  }
}

async function getCustomerOrdersController(req, res, next) {
  try {
    const orders = await getCustomerOrders(req.user.id);
    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
}

async function getCustomerNotificationsController(req, res, next) {
  try {
    const notifications = await getCustomerNotifications(req.user.id);
    res.status(200).json({ success: true, notifications, unread_count: notifications.length });
  } catch (error) {
    next(error);
  }
}

async function getVendorSalesSummaryController(req, res, next) {
  try {
    const userId = req.user.id;

    const vendorResult = await pool.query(
      `SELECT vendor_id
       FROM vendors
       WHERE user_id = $1`,
      [userId]
    );

    if (vendorResult.rows.length === 0) {
      throw new AppError("Vendor not found", 404);
    }

    const vendorId = vendorResult.rows[0].vendor_id;
    const summary = await getVendorSalesSummary(vendorId);

    res.status(200).json({
      success: true,
      summary
    });
  } catch (e) {
    next(e);
  }
}

async function getVendorNotificationsController(req, res, next) {
  try {
    const vendorResult = await pool.query(
      `SELECT vendor_id FROM vendors WHERE user_id = $1`,
      [req.user.id]
    );

    if (vendorResult.rows.length === 0) {
      throw new AppError("Vendor not found", 404);
    }

    const notifications = await getVendorNotifications(vendorResult.rows[0].vendor_id);

    res.status(200).json({
      success: true,
      notifications,
      unread_count: notifications.length
    });
  } catch (e) {
    next(e);
  }
}


async function updateVendorOrderStatus(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["accepted", "preparing", "ready", "delivered", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      throw new AppError("Invalid order status", 400);
    }

    // users.id → vendors.vendor_id
    const vendorResult = await pool.query(
      `SELECT vendor_id
       FROM vendors
       WHERE user_id = $1`,
      [userId]
    );

    if (vendorResult.rows.length === 0) {
      throw new AppError("Vendor not found", 404);
    }

    const vendorId = vendorResult.rows[0].vendor_id;

    const updateResult = await updateOrderStatus(
      id,
      vendorId,
      status
    );

    if (updateResult.reason === "not_found") {
      throw new AppError("Order not found", 404);
    }

    if (updateResult.reason === "invalid_transition") {
      throw new AppError(
        `Cannot change order status from ${updateResult.currentStatus} to ${status}`,
        409
      );
    }

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order: updateResult.order
    });

  } catch (e) {
    next(e);
  }
}


module.exports = {
  createCustomerOrdersController,
  getCustomerOrdersController,
  getCustomerNotificationsController,
  getVendorOrdersController,
  getVendorSalesSummaryController,
  getVendorNotificationsController,
  updateVendorOrderStatus
};