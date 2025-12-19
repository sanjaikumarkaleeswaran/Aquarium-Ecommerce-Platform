// Script to verify the image for Frozen Bloodworms product
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

async function verifyFrozenBloodwormsImage() {
  try {
    console.log('Verifying Frozen Bloodworms product image...\n');
    
    // Find the Frozen Bloodworms product
    const product = await Product.findOne({ name: 'Frozen Bloodworms' });
    
    if (!product) {
      console.log('❌ Frozen Bloodworms product not found!');
      mongoose.connection.close();
      return;
    }
    
    console.log(`Product: ${product.name}`);
    console.log(`Category: ${product.category}`);
    console.log(`Images: ${product.images}`);
    
    // Check if the image was updated correctly
    const expectedImageUrl = 'https://www.amazingamazon.com.au/cdn/shop/files/hikari-frozen-bloodworm-100g-x-12-amazing-amazon-2.jpg?v=1763625329';
    
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
    console.error('Error verifying Frozen Bloodworms image:', error);
    mongoose.connection.close();
  }
}

verifyFrozenBloodwormsImage();