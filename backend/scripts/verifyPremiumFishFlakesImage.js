// Script to verify the image for Premium Fish Flakes product
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

async function verifyPremiumFishFlakesImage() {
  try {
    console.log('Verifying Premium Fish Flakes product image...\n');
    
    // Find the Premium Fish Flakes product
    const product = await Product.findOne({ name: 'Premium Fish Flakes' });
    
    if (!product) {
      console.log('❌ Premium Fish Flakes product not found!');
      mongoose.connection.close();
      return;
    }
    
    console.log(`Product: ${product.name}`);
    console.log(`Category: ${product.category}`);
    console.log(`Images: ${product.images}`);
    
    // Check if the image was updated correctly
    const expectedImageUrl = 'https://aquaticarts.com/cdn/shop/products/1oz-Tropical-Flake-Primary_1800x1800.jpg?v=1637593006';
    
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
    console.error('Error verifying Premium Fish Flakes image:', error);
    mongoose.connection.close();
  }
}

verifyPremiumFishFlakesImage();