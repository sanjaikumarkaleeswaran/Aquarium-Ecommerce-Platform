// Script to update the image for Anti-Parasite Treatment product
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

async function updateAntiParasiteTreatmentImage() {
  try {
    console.log('Updating Anti-Parasite Treatment product image...\n');
    
    // Find the Anti-Parasite Treatment product
    const product = await Product.findOne({ name: 'Anti-Parasite Treatment' });
    
    if (!product) {
      console.log('❌ Anti-Parasite Treatment product not found!');
      mongoose.connection.close();
      return;
    }
    
    console.log(`Found product: ${product.name}`);
    console.log(`Current images: ${product.images}`);
    
    // Update with the new image URL
    const newImageUrl = 'https://m.media-amazon.com/images/I/61ODRLopGLS._AC_UF1000,1000_QL80_.jpg';
    
    product.images = [newImageUrl];
    
    // Save the updated product
    await product.save();
    
    console.log(`\n✅ Successfully updated image for ${product.name}`);
    console.log(`New image URL: ${product.images[0]}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error updating Anti-Parasite Treatment image:', error);
    mongoose.connection.close();
  }
}

updateAntiParasiteTreatmentImage();