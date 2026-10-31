const mongoose = require("mongoose");

const Product = require("../models/Product");
const Organization = require("../models/Organization");

// GET DASHBOARD OVERVIEW
const getDashboardOverview = async (req, res) => {
    try {
        const organizationId = req.user.organizationId;

        // Fetch organization settings
        const organization = await Organization.findById(
            organizationId
        ).select("defaultLowStockThreshold");

        if (!organization) {
            return res.status(404).json({
                success: false,
                message: "Organization not found"
            });
        }

        const defaultThreshold =
            organization.defaultLowStockThreshold ?? 5;

        // Dashboard aggregation
        const result = await Product.aggregate([
            {
                $match: {
                    organizationId: new mongoose.Types.ObjectId(
                        organizationId
                    )
                }
            },
            {
                $facet: {

                    // Total products and quantity
                    summary: [
                        {
                            $group: {
                                _id: null,

                                totalProducts: {
                                    $sum: 1
                                },

                                totalQuantity: {
                                    $sum: "$quantityOnHand"
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                totalProducts: 1,
                                totalQuantity: 1
                            }
                        }
                    ],

                    // Low stock products
                    lowStockProducts: [
                        {
                            $addFields: {
                                effectiveThreshold: {
                                    $ifNull: [
                                        "$lowStockThreshold",
                                        defaultThreshold
                                    ]
                                }
                            }
                        },
                        {
                            $match: {
                                $expr: {
                                    $lte: [
                                        "$quantityOnHand",
                                        "$effectiveThreshold"
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                sku: 1,
                                quantityOnHand: 1,
                                lowStockThreshold:
                                    "$effectiveThreshold"
                            }
                        },
                        {
                            $sort: {
                                quantityOnHand: 1
                            }
                        }
                    ]
                }
            }
        ]);

        const dashboard = result[0];

        const summary = dashboard.summary[0] || {
            totalProducts: 0,
            totalQuantity: 0
        };

        return res.status(200).json({
            success: true,
            dashboard: {
                totalProducts: summary.totalProducts,
                totalQuantity: summary.totalQuantity,

                lowStockCount:
                    dashboard.lowStockProducts.length,

                lowStockProducts:
                    dashboard.lowStockProducts,

                defaultLowStockThreshold: defaultThreshold
            }
        });

    } catch (error) {
        console.error("Dashboard error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data"
        });
    }
};

module.exports = {
    getDashboardOverview
};