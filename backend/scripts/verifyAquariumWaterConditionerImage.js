import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

async function verifyAquariumWaterConditionerImage() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Find the Aquarium Water Conditioner product
    const product = await Product.findOne({ name: 'Aquarium Water Conditioner' });
    
    if (!product) {
      console.log('Aquarium Water Conditioner product not found');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`Product: ${product.name}`);
    console.log(`Category: ${product.category}`);
    console.log(`Current images: ${product.images}`);
    
    // Check if the image was updated correctly
    const expectedImageUrl = 'https://m.media-amazon.com/images/I/81IKLo-59qL.jpg';
    
    if (product.images && product.images.length > 0 && product.images[0] === expectedImageUrl) {
      console.log('✅ Image successfully updated!');
    } else {
      console.log('❌ Image was not updated correctly.');
      console.log(`Expected: ${expectedImageUrl}`);
      console.log(`Actual: ${product.images ? product.images[0] : 'No images'}`);
    }
    
    // Close the connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error verifying Aquarium Water Conditioner image:', error);
    process.exit(1);
  }
}

// Run the script
verifyAquariumWaterConditionerImage();