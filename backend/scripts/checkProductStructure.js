import mongoose from "mongoose";
import Product from "../models/Product.js";
import dotenv from "dotenv";

dotenv.config();

const checkProductStructure = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aquarium-commerce');
    console.log("Connected to MongoDB");

    // Get a sample product
    const sampleProduct = await Product.findOne();
    console.log("Sample product structure:");
    console.log(JSON.stringify(sampleProduct, null, 2));
    
    // Get a specific product like Blue Tang Fish
    const blueTang = await Product.findOne({ name: "Blue Tang Fish" });
    console.log("\nBlue Tang Fish structure:");
    console.log(JSON.stringify(blueTang, null, 2));
    
    process.exit();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

checkProductStructure();