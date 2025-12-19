import mongoose from "mongoose";
import Product from "../models/Product.js";
import dotenv from "dotenv";

dotenv.config();

const checkPricing = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aquarium-commerce');
    console.log("Connected to MongoDB");

    // Get a few sample products
    const sampleProducts = await Product.find().limit(5);
    console.log("\nSample Product Pricing:");
    sampleProducts.forEach(p => {
      console.log(`${p.name} - Customer Price: ${p.priceCustomer}, Wholesaler Price: ${p.priceWholesaler}`);
    });
    
    process.exit();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

checkPricing();