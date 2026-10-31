const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
            index: true
        },

        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true
        },

        sku: {
            type: String,
            required: [true, "SKU is required"],
            trim: true,
            uppercase: true
        },

        description: {
            type: String,
            trim: true,
            default: ""
        },

        quantityOnHand: {
            type: Number,
            default: 0,
            min: 0,
            validate: {
                validator: Number.isInteger,
                message: "Quantity must be an integer"
            }
        },

        costPrice: {
            type: Number,
            default: null,
            min: 0
        },

        sellingPrice: {
            type: Number,
            default: null,
            min: 0
        },

        lowStockThreshold: {
            type: Number,
            default: null,
            min: 0,
            validate: {
                validator: function(value) {
                    return value === null || Number.isInteger(value);
                },
                message: "Low stock threshold must be an integer"
            }
        }
    },
    {
        timestamps: true
    }
);

// SKU must be unique within an organization
productSchema.index(
    { organizationId: 1, sku: 1 },
    { unique: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;