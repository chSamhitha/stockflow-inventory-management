const mongoose = require("mongoose");
const Product = require("../models/Product");

// CREATE PRODUCT
const createProduct = async (req, res) => {
    try {
        const {
            name,
            sku,
            description,
            quantityOnHand,
            costPrice,
            sellingPrice,
            lowStockThreshold
        } = req.body;

        if (!name?.trim() || !sku?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Product name and SKU are required"
            });
        }

        const product = await Product.create({
            organizationId: req.user.organizationId,
            name,
            sku,
            description,
            quantityOnHand,
            costPrice,
            sellingPrice,
            lowStockThreshold
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "SKU already exists in your organization"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create product"
        });
    }
};
// GET ALL PRODUCTS
const getProducts = async (req, res) => {
    try {
        const { search } = req.query;

        const filter = {
            organizationId: req.user.organizationId
        };

        if (search?.trim()) {
            const escapedSearch = search.trim().replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            filter.$or = [
                { name: { $regex: escapedSearch, $options: "i" } },
                { sku: { $regex: escapedSearch, $options: "i" } }
            ];
        }

        const products = await Product.find(filter)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch products"
        });
    }
};
// GET PRODUCT BY ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findOne({
            _id: id,
            organizationId: req.user.organizationId
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch product"
        });
    }
};
// UPDATE PRODUCT
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const allowedFields = [
            "name",
            "sku",
            "description",
            "quantityOnHand",
            "costPrice",
            "sellingPrice",
            "lowStockThreshold"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (Object.prototype.hasOwnProperty.call(req.body, field)) {
                updates[field] = req.body[field];
            }
        }

        if (
            updates.name !== undefined &&
            (typeof updates.name !== "string" || !updates.name.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "Product name cannot be empty"
            });
        }

        if (
            updates.sku !== undefined &&
            (typeof updates.sku !== "string" || !updates.sku.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "SKU cannot be empty"
            });
        }

        const product = await Product.findOneAndUpdate(
            {
                _id: id,
                organizationId: req.user.organizationId
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "SKU already exists in your organization"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update product"
        });
    }
};
// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findOneAndDelete({
            _id: id,
            organizationId: req.user.organizationId
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete product"
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};