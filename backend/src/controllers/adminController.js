const { getAdminOverview } = require("../models/adminModel");
const { deleteVendor } = require("../models/vendorModel");
const AppError = require("../utils/AppError");

async function getAdminOverviewController(req, res, next) {
  try {
    const overview = await getAdminOverview();
    res.status(200).json({ success: true, ...overview });
  } catch (error) {
    next(error);
  }
}

async function deleteVendorController(req, res, next) {
  try {
    const vendor = await deleteVendor(req.params.id);

    if (!vendor) {
      throw new AppError("Vendor not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Vendor deleted successfully",
      vendor
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAdminOverviewController, deleteVendorController };