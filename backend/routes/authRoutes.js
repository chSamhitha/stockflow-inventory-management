const express = require("express");

const router = express.Router();

const {
    signup,
    login
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

router.post("/signup", signup);

router.post("/login", login);

// Verify current authenticated user
router.get("/me", protect, (req, res) => {
    res.status(200).json({
        success: true,
        user: {
            id: req.user._id,
            email: req.user.email,
            organizationId: req.user.organizationId
        }
    });
});

module.exports = router;