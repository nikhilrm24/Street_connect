const express = require("express");
const { getAdminOverviewController } = require("../controllers/adminController");
const verifyToken = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/admin/overview",
  verifyToken,
  roleMiddleware("admin"),
  getAdminOverviewController
);

module.exports = router;