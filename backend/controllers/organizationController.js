const Organization = require("../models/Organization");

// GET ORGANIZATION SETTINGS
const getOrganizationSettings = async (req, res) => {
    try {
        const organization = await Organization.findById(
            req.user.organizationId
        );

        if (!organization) {
            return res.status(404).json({
                success: false,
                message: "Organization not found"
            });
        }

        return res.status(200).json({
            success: true,
            settings: {
                organizationName: organization.name,
                defaultLowStockThreshold:
                    organization.defaultLowStockThreshold
            }
        });

    } catch (error) {
        console.error("Get settings error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch organization settings"
        });
    }
};


// UPDATE ORGANIZATION SETTINGS
const updateOrganizationSettings = async (req, res) => {
    try {
        const { defaultLowStockThreshold } = req.body;

        if (
            defaultLowStockThreshold === undefined ||
            !Number.isInteger(defaultLowStockThreshold) ||
            defaultLowStockThreshold < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Threshold must be a non-negative integer"
            });
        }

        const organization = await Organization.findByIdAndUpdate(
            req.user.organizationId,
            {
                defaultLowStockThreshold
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!organization) {
            return res.status(404).json({
                success: false,
                message: "Organization not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Settings updated successfully",
            settings: {
                organizationName: organization.name,
                defaultLowStockThreshold:
                    organization.defaultLowStockThreshold
            }
        });

    } catch (error) {
        console.error("Update settings error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update organization settings"
        });
    }
};

module.exports = {
    getOrganizationSettings,
    updateOrganizationSettings
};