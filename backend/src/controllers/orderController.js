const {
  getVendorOrders,
  getVendorSalesSummary,
  updateOrderStatus
} = require("../models/ordersModel");

const { pool } = require("../db");
const AppError = require("../utils/AppError");

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
  getVendorOrdersController,
  getVendorSalesSummaryController,
  updateVendorOrderStatus
};