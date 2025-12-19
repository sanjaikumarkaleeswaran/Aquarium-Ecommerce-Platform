import mongoose from "mongoose";
import Product from "../models/Product.js";
import dotenv from "dotenv";

dotenv.config();

const updateClownFishImage = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aquarium-commerce');
    console.log("Connected to MongoDB");

    // Find the Clown Fish product
    const clownFish = await Product.findOne({ name: "Clown Fish" });
    
    if (!clownFish) {
      console.log("Clown Fish product not found");
      process.exit(1);
    }

    console.log("Found Clown Fish product:", clownFish.name);
    console.log("Current images:", clownFish.images);

    // Update with the new image URL you provided
    const newImageUrl = "https://cdn.mos.cms.futurecdn.net/4UdEs7tTKwLJbxZPUYR3hF-1000-80.jpg";
    
    // Update the product with the new image
    clownFish.images = [newImageUrl];
    
    // Save the updated product
    await clownFish.save();
    
    console.log("Successfully updated Clown Fish product with new image");
    console.log("Updated images:", clownFish.images);
    
    process.exit(0);
  } catch (error) {
    console.error("Error updating Clown Fish product:", error);
    process.exit(1);
  }
};

updateClownFishImage();