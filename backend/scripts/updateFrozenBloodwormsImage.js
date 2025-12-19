// Script to update the image for Frozen Bloodworms product
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

async function updateFrozenBloodwormsImage() {
  try {
    console.log('Updating Frozen Bloodworms product image...\n');
    
    // Find the Frozen Bloodworms product
    const product = await Product.findOne({ name: 'Frozen Bloodworms' });
    
    if (!product) {
      console.log('❌ Frozen Bloodworms product not found!');
      mongoose.connection.close();
      return;
    }
    
    console.log(`Found product: ${product.name}`);
    console.log(`Current images: ${product.images}`);
    
    // Update with the new image URL
    const newImageUrl = 'https://www.amazingamazon.com.au/cdn/shop/files/hikari-frozen-bloodworm-100g-x-12-amazing-amazon-2.jpg?v=1763625329';
    
    product.images = [newImageUrl];
    
    // Save the updated product
    await product.save();
    
    console.log(`\n✅ Successfully updated image for ${product.name}`);
    console.log(`New image URL: ${product.images[0]}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error updating Frozen Bloodworms image:', error);
    mongoose.connection.close();
  }
}

updateFrozenBloodwormsImage();