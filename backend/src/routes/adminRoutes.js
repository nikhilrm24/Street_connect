const express = require("express");
const {
  getAdminOverviewController,
  deleteVendorController
} = require("../controllers/adminController");
const verifyToken = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/admin/overview",
  verifyToken,
  roleMiddleware("admin"),
  getAdminOverviewController
);

router.delete(
  "/admin/vendors/:id",
  verifyToken,
  roleMiddleware("admin"),
  deleteVendorController
);

module.exports = router;