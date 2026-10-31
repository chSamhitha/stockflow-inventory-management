const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Organization name is required"],
            trim: true
        },

        defaultLowStockThreshold: {
            type: Number,
            default: 5,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

const Organization = mongoose.model(
    "Organization",
    organizationSchema
);

module.exports = Organization;