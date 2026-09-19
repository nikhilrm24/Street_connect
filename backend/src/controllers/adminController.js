const { getAdminOverview } = require("../models/adminModel");

async function getAdminOverviewController(req, res, next) {
  try {
    const overview = await getAdminOverview();
    res.status(200).json({ success: true, ...overview });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAdminOverviewController };