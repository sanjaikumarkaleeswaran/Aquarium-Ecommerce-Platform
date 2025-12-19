import mongoose from "mongoose";
import Product from "../models/Product.js";
import dotenv from "dotenv";

dotenv.config();

// Define category-based images
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

const updateProductImagesByCategory = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aquarium-commerce');
    console.log("Connected to MongoDB");

    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    let updatedCount = 0;
    
    // Update each product based on category if it doesn't have appropriate images
    for (const product of products) {
      const productCategory = product.category;
      
      // Check if product has images and if they're appropriate for the category
      if (!product.images || product.images.length === 0 || shouldUpdateImages(product)) {
        if (categoryImages[productCategory]) {
          // Update product with category-based images
          product.images = categoryImages[productCategory];
          await product.save();
          console.log(`Updated images for ${product.name} (${productCategory}): ${product.images.length} images`);
          updatedCount++;
        } else {
          console.log(`No category images defined for ${product.name} (${productCategory})`);
        }
      }
    }
    
    console.log(`Successfully updated ${updatedCount} products with category-based images`);
    process.exit(0);
  } catch (error) {
    console.error("Error updating product images:", error);
    process.exit(1);
  }
};

// Helper function to determine if images should be updated
const shouldUpdateImages = (product) => {
  // If product has images but they're generic or from the wrong category, update them
  if (!product.images || product.images.length === 0) return true;
  
  // Check if images are from the correct category
  const productCategory = product.category;
  const categoryImageUrls = categoryImages[productCategory] || [];
  
  // If no category images defined, don't update
  if (categoryImageUrls.length === 0) return false;
  
  // Check if current images match category images
  for (const imageUrl of product.images) {
    let isMatch = false;
    for (const categoryImageUrl of categoryImageUrls) {
      if (imageUrl.includes(categoryImageUrl.split('/').pop().split('?')[0])) {
        isMatch = true;
        break;
      }
    }
    if (!isMatch) {
      return true; // Images don't match category, should update
    }
  }
  
  return false; // Images match category, no need to update
};

updateProductImagesByCategory();