// Script to verify the image for Anti-Parasite Treatment product
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

async function verifyAntiParasiteTreatmentImage() {
  try {
    console.log('Verifying Anti-Parasite Treatment product image...\n');
    
    // Find the Anti-Parasite Treatment product
    const product = await Product.findOne({ name: 'Anti-Parasite Treatment' });
    
    if (!product) {
      console.log('❌ Anti-Parasite Treatment product not found!');
      mongoose.connection.close();
      return;
    }
    
    console.log(`Product: ${product.name}`);
    console.log(`Category: ${product.category}`);
    console.log(`Images: ${product.images}`);
    
    // Check if the image was updated correctly
    const expectedImageUrl = 'https://m.media-amazon.com/images/I/61ODRLopGLS._AC_UF1000,1000_QL80_.jpg';
    
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
    console.error('Error verifying Anti-Parasite Treatment image:', error);
    mongoose.connection.close();
  }
}

verifyAntiParasiteTreatmentImage();