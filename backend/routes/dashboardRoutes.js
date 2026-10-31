const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    getDashboardOverview
} = require("../controllers/dashboardController");

// Protect all dashboard endpoints
router.use(protect);

router.get("/overview", getDashboardOverview);

module.exports = router;