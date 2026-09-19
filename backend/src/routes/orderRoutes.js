
const express = require("express");

const {
  getVendorOrdersController,
  updateVendorOrderStatus
} = require("../controllers/orderController");

const verifyToken = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/vendors/orders",
  verifyToken,
  roleMiddleware("vendor"),
  getVendorOrdersController
);

router.put(
  "/vendors/orders/:id/status",
  verifyToken,
  roleMiddleware("vendor"),
  updateVendorOrderStatus
);

module.exports = router;