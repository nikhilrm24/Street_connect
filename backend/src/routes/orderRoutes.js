
const express = require("express");

const {
  getVendorOrdersController,
  createCustomerOrdersController,
  getCustomerOrdersController,
  getCustomerNotificationsController,
  getVendorSalesSummaryController,
  getVendorNotificationsController,
  updateVendorOrderStatus
} = require("../controllers/orderController");

const verifyToken = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/orders",
  verifyToken,
  roleMiddleware("customer"),
  createCustomerOrdersController
);

router.get(
  "/orders/customer",
  verifyToken,
  roleMiddleware("customer"),
  getCustomerOrdersController
);

router.get(
  "/orders/notifications",
  verifyToken,
  roleMiddleware("customer"),
  getCustomerNotificationsController
);

router.get(
  "/vendors/orders",
  verifyToken,
  roleMiddleware("vendor"),
  getVendorOrdersController
);

router.get(
  "/vendors/sales-summary",
  verifyToken,
  roleMiddleware("vendor"),
  getVendorSalesSummaryController
);

router.get(
  "/vendors/notifications",
  verifyToken,
  roleMiddleware("vendor"),
  getVendorNotificationsController
);

router.put(
  "/vendors/orders/:id/status",
  verifyToken,
  roleMiddleware("vendor"),
  updateVendorOrderStatus
);

module.exports = router;