// Script to verify the image for Fish Vitamin Supplement product
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

async function verifyFishVitaminSupplementImage() {
  try {
    console.log('Verifying Fish Vitamin Supplement product image...\n');
    
    // Find the Fish Vitamin Supplement product
    const product = await Product.findOne({ name: 'Fish Vitamin Supplement' });
    
    if (!product) {
      console.log('❌ Fish Vitamin Supplement product not found!');
      mongoose.connection.close();
      return;
    }
    
    console.log(`Product: ${product.name}`);
    console.log(`Category: ${product.category}`);
    console.log(`Images: ${product.images}`);
    
    // Check if the image was updated correctly
    const expectedImageUrl = 'https://www.aquanatureonline.com/wp-content/uploads/2021/08/vitamin.jpg';
    
    if (product.images && product.images.length > 0 && product.images[0] === expectedImageUrl) {
      console.log('\n✅ Image successfully updated!');
      console.log(`Current image URL: ${product.images[0]}`);
    } else {
      console.log('\n❌ Image was not updated correctly.');
      console.log(`Expected: ${expectedImageUrl}`);
      console.log(`Actual: ${product.images ? product.images[0] : 'No image'}`);
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error verifying Fish Vitamin Supplement image:', error);
    mongoose.connection.close();
  }
}

verifyFishVitaminSupplementImage();