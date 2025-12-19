// Script to update the image for Premium Fish Flakes product
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

async function updatePremiumFishFlakesImage() {
  try {
    console.log('Updating Premium Fish Flakes product image...\n');
    
    // Find the Premium Fish Flakes product
    const product = await Product.findOne({ name: 'Premium Fish Flakes' });
    
    if (!product) {
      console.log('❌ Premium Fish Flakes product not found!');
      mongoose.connection.close();
      return;
    }
    
    console.log(`Found product: ${product.name}`);
    console.log(`Current images: ${product.images}`);
    
    // Update with the new image URL
    const newImageUrl = 'https://aquaticarts.com/cdn/shop/products/1oz-Tropical-Flake-Primary_1800x1800.jpg?v=1637593006';
    
    product.images = [newImageUrl];
    
    // Save the updated product
    await product.save();
    
    console.log(`\n✅ Successfully updated image for ${product.name}`);
    console.log(`New image URL: ${product.images[0]}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error updating Premium Fish Flakes image:', error);
    mongoose.connection.close();
  }
}

updatePremiumFishFlakesImage();