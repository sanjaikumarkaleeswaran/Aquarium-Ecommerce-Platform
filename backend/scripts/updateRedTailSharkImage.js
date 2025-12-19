import mongoose from "mongoose";
import Product from "../models/Product.js";
import dotenv from "dotenv";

dotenv.config();

const updateRedTailSharkImage = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aquarium-commerce');
    console.log("Connected to MongoDB");

    // Find the Red Tail Shark product
    const redTailShark = await Product.findOne({ name: "Red Tail Shark" });
    
    if (!redTailShark) {
      console.log("Red Tail Shark product not found");
      process.exit(1);
    }

    console.log("Found Red Tail Shark product:", redTailShark.name);
    console.log("Current images:", redTailShark.images);

    // Update with the new image URL you provided
    const newImageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReU_yvDLJDNS4Yhm4x6P5wZQ7nuGbWmlEz-g&s";
    
    // Update the product with the new image
    redTailShark.images = [newImageUrl];
    
    // Save the updated product
    await redTailShark.save();
    
    console.log("Successfully updated Red Tail Shark product with new image");
    console.log("Updated images:", redTailShark.images);
    
    process.exit(0);
  } catch (error) {
    console.error("Error updating Red Tail Shark product:", error);
    process.exit(1);
  }
};

updateRedTailSharkImage();