import mongoose from "mongoose";
import Product from "../models/Product.js";
import dotenv from "dotenv";

dotenv.config();

// Define specific images for each product
const productImages = {
  // Marine Fish
  "Blue Tang Fish": [
    "https://images.unsplash.com/photo-1544783745-9b0c9c0d4e3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-15320227352178-19b1b3a6d9c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ],
  "Clown Fish": [
    "https://cdn.mos.cms.futurecdn.net/4UdEs7tTKwLJbxZPUYR3hF-1000-80.jpg"
  ],
  "Mandarin Goby": [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyq4Q7zXqXM17b1zXH9Ry4b3bVwJ8X8i3y5g&s"
  ],
  "Oscar Fish": [
    "https://images.unsplash.com/photo-1544783745-9b0c9c0d4e3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-15320227352178-19b1b3a6d9c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ],
  "Red Tail Shark": [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReU_yvDLJDNS4Yhm4x6P5wZQ7nuGbWmlEz-g&s"
  ],
  
  // Fresh Water Fish
  "Angelfish": [
    "https://images.unsplash.com/photo-1544787280-7a5e3b3f8a8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-15320227352178-19b1b3a6d9c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ],
  "Cichlid": [
    "https://images.unsplash.com/photo-1544787280-7a5e3b3f8a8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-15320227352178-19b1b3a6d9c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ],
  "Discus Fish": [
    "https://images.unsplash.com/photo-1544783745-9b0c9c0d4e3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-15320227352178-19b1b3a6d9c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ],
  "Goldfish": [
    "https://images.unsplash.com/photo-1544787280-7a5e3b3f8a8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-15320227352178-19b1b3a6d9c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ],
  "Honey Gourami": [
    "https://images.unsplash.com/photo-1544787280-7a5e3b3f8a8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-15320227352178-19b1b3a6d9c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ],
  "Neon Tetra": [
    "https://images.unsplash.com/photo-1544787280-7a5e3b3f8a8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-15320227352178-19b1b3a6d9c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ],
  "Tiger Barb": [
    "https://images.unsplash.com/photo-1544787280-7a5e3b3f8a8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-15320227352178-19b1b3a6d9c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ],
  
  // Tanks
  "Aquarium Tank 20gal": [
    "https://images.unsplash.com/photo-1595783580573-96e3cf0b4b8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ],
  "Large Reef Tank 100gal": [
    "https://images.unsplash.com/photo-1595783580573-96e3cf0b4b8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ],
  "Nano Aquarium 5gal": [
    "https://images.unsplash.com/photo-1595783580573-96e3cf0b4b8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ],
  
  // Pots
  "Aquarium Clay Pots": [
    "https://images.unsplash.com/photo-1609894851186-94a56e30b0d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ],
  "Ceramic Flower Pot Set": [
    "https://images.unsplash.com/photo-1609894851186-94a56e30b0d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ],
  "Planting Pots with Net": [
    "https://images.unsplash.com/photo-1609894851186-94a56e30b0d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ],
  
  // Decorative Items
  "Aquarium Driftwood": [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWn6LkU5ijY8wXE8zfx33gjtAc5tf7D9RR4A&s"
  ],
  "Artificial Coral Set": [
    "https://images.unsplash.com/photo-1609894851186-94a56e30b0d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ],
  "Decorative Castle": [
    "https://images.unsplash.com/photo-1609894851186-94a56e30b0d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ],
  
  // Foods
  "Frozen Bloodworms": [
    "https://images.unsplash.com/photo-1544787280-7a5e3b3f8a8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ],
  "Premium Fish Flakes": [
    "https://images.unsplash.com/photo-1544787280-7a5e3b3f8a8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ],
  "Spirulina Algae Wafers": [
    "https://images.unsplash.com/photo-1544787280-7a5e3b3f8a8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ],
  
  // Medicines
  "Anti-Parasite Treatment": [
    "https://images.unsplash.com/photo-1544787280-7a5e3b3f8a8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ],
  "Aquarium Water Conditioner": [
    "https://m.media-amazon.com/images/I/81IKLo-59qL.jpg"
  ],  "Fish Vitamin Supplement": [
    "https://images.unsplash.com/photo-1544787280-7a5e3b3f8a8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  ]
};

const assignUniqueImages = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aquarium-commerce');
    console.log("Connected to MongoDB");

    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    let updatedCount = 0;
    
    // Update each product with specific images
    for (const product of products) {
      const productName = product.name;
      
      if (productImages[productName]) {
        // Update product with specific images
        product.images = productImages[productName];
        await product.save();
        console.log(`Updated images for ${productName}: ${product.images.length} images`);
        updatedCount++;
      } else {
        console.log(`No specific images defined for ${productName}`);
      }
    }
    
    console.log(`Successfully updated ${updatedCount} products with unique images`);
    process.exit(0);
  } catch (error) {
    console.error("Error updating product images:", error);
    process.exit(1);
  }
};

assignUniqueImages();