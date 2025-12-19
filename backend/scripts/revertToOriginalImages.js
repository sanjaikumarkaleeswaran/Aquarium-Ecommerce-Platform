import mongoose from "mongoose";
import Product from "../models/Product.js";
import dotenv from "dotenv";

dotenv.config();

// Generic images by category that would have been used before
const categoryImages = {
  "Marine Fish": [
    "https://images.unsplash.com/photo-1544783745-9b0c9c0d4e3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-15320227352178-19b1b3a6d9c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ],
  "Fresh Water Fish": [
    "https://images.unsplash.com/photo-1544787280-7a5e3b3f8a8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-15320227352178-19b1b3a6d9c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ],
  "Tanks": [
    "https://images.unsplash.com/photo-1595783580573-96e3cf0b4b8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ],
  "Pots": [
    "https://images.unsplash.com/photo-1609894851186-94a56e30b0d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ],
  "Decorative Items": [
    "https://images.unsplash.com/photo-1609894851186-94a56e30b0d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ],
  "Foods": [
    "https://images.unsplash.com/photo-1544787280-7a5e3b3f8a8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ],
  "Medicines": [
    "https://images.unsplash.com/photo-1544787280-7a5e3b3f8a8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ]
};

const revertToOriginalImages = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aquarium-commerce');
    console.log("Connected to MongoDB");

    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    let updatedCount = 0;
    
    // Update each product with category-based images
    for (const product of products) {
      const category = product.category;
      
      if (categoryImages[category]) {
        // Update product with category-based images
        product.images = [...categoryImages[category]]; // Create a copy of the array
        await product.save();
        console.log(`Reverted images for ${product.name} (${category}): ${product.images.length} images`);
        updatedCount++;
      } else {
        console.log(`No category images defined for ${product.name} (${category})`);
      }
    }
    
    console.log(`Successfully reverted ${updatedCount} products to original images`);
    process.exit(0);
  } catch (error) {
    console.error("Error reverting product images:", error);
    process.exit(1);
  }
};

revertToOriginalImages();