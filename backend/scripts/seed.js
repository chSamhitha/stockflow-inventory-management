
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Organization = require("../models/Organization");
const Product = require("../models/Product");

const sampleUsers = [
  {
    email: "alice@storeone.com",
    password: "Test@123",
    organizationName: "Store One",
    defaultLowStockThreshold: 5,
    products: [
      { name: "iPhone 17", sku: "IPH17-001", quantityOnHand: 20, sellingPrice: 75000, lowStockThreshold: 5 },
      { name: "Samsung S25", sku: "SAM25-001", quantityOnHand: 3, sellingPrice: 68000 },
      { name: "AirPods Pro", sku: "AIRPRO-001", quantityOnHand: 15, sellingPrice: 22000 },
      { name: "Apple Watch", sku: "WATCH-001", quantityOnHand: 4, sellingPrice: 35000 },
      { name: "iPhone Charger", sku: "CHARGER-001", quantityOnHand: 50, sellingPrice: 2000 }
    ]
  },
  {
    email: "bob@storetwo.com",
    password: "Test@123",
    organizationName: "Store Two",
    defaultLowStockThreshold: 10,
    products: [
      { name: "Dell Laptop", sku: "DELL-001", quantityOnHand: 25, sellingPrice: 65000 },
      { name: "HP Keyboard", sku: "HPKEY-001", quantityOnHand: 5, sellingPrice: 1500 },
      { name: "Logitech Mouse", sku: "LOGM-001", quantityOnHand: 8, sellingPrice: 900 },
      { name: "Samsung Monitor", sku: "MON-001", quantityOnHand: 2, sellingPrice: 18000 },
      { name: "USB Hub", sku: "USB-001", quantityOnHand: 40, sellingPrice: 1200 }
    ]
  },
  {
    email: "charlie@storethree.com",
    password: "Test@123",
    organizationName: "Store Three",
    defaultLowStockThreshold: 3,
    products: [
      { name: "Nike Shoes", sku: "NIKE-001", quantityOnHand: 30, sellingPrice: 5000 },
      { name: "Adidas T-Shirt", sku: "ADI-001", quantityOnHand: 2, sellingPrice: 1800 },
      { name: "Puma Shorts", sku: "PUMA-001", quantityOnHand: 12, sellingPrice: 1500 },
      { name: "Sports Socks", sku: "SOCK-001", quantityOnHand: 1, sellingPrice: 400 },
      { name: "Badminton Racket", sku: "RACKET-001", quantityOnHand: 7, sellingPrice: 3500 }
    ]
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    for (const userData of sampleUsers) {
      let user = await User.findOne({ email: userData.email });

      let organization;

      if (user) {
        organization = await Organization.findById(user.organizationId);

        if (!organization) {
          throw new Error(`Organization missing for ${userData.email}`);
        }

        console.log(`User already exists: ${userData.email}`);
      } else {
        organization = await Organization.create({
          name: userData.organizationName,
          defaultLowStockThreshold: userData.defaultLowStockThreshold
        });

        const hashedPassword = await bcrypt.hash(userData.password, 12);

        user = await User.create({
          email: userData.email,
          password: hashedPassword,
          organizationId: organization._id
        });

        console.log(`Created user: ${userData.email}`);
      }

      // Upsert products so rerunning the script doesn't duplicate them.
      for (const productData of userData.products) {
        await Product.updateOne(
          {
            organizationId: organization._id,
            sku: productData.sku
          },
          {
            $set: {
              ...productData,
              organizationId: organization._id
            }
          },
          { upsert: true, runValidators: true }
        );
      }

      console.log(
        `Seeded ${userData.products.length} products for ${userData.email}`
      );
    }

    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
