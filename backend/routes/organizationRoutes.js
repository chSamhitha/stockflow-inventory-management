const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    getOrganizationSettings,
    updateOrganizationSettings
} = require("../controllers/organizationController");

// Protect all organization settings APIs
router.use(protect);

// Get settings
router.get("/settings", getOrganizationSettings);

// Update settings
router.put("/settings", updateOrganizationSettings);

module.exports = router;