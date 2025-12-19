// Script to update the image for Fish Vitamin Supplement product
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Configure dotenv
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aquarium-commerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

import Product from '../models/Product.js';

async function updateFishVitaminSupplementImage() {
  try {
    console.log('Updating Fish Vitamin Supplement product image...\n');
    
    // Find the Fish Vitamin Supplement product
    const product = await Product.findOne({ name: 'Fish Vitamin Supplement' });
    
    if (!product) {
      console.log('❌ Fish Vitamin Supplement product not found!');
      mongoose.connection.close();
      return;
    }
    
    console.log(`Found product: ${product.name}`);
    console.log(`Current images: ${product.images}`);
    
    // Update with the new image URL
    const newImageUrl = 'https://www.aquanatureonline.com/wp-content/uploads/2021/08/vitamin.jpg';
    
    product.images = [newImageUrl];
    
    // Save the updated product
    await product.save();
    
    console.log(`\n✅ Successfully updated image for ${product.name}`);
    console.log(`New image URL: ${product.images[0]}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error updating Fish Vitamin Supplement image:', error);
    mongoose.connection.close();
  }
}

updateFishVitaminSupplementImage();