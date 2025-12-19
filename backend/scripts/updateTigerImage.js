import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

async function updateTigerImage() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Find the Tiger Barb product
    const product = await Product.findOne({ name: 'Tiger Barb' });
    
    if (!product) {
      console.log('Tiger Barb product not found');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`Found product: ${product.name}`);
    console.log(`Current images: ${product.images}`);
    
    // Update the image URL
    const newImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaMaW1IVGBFJuSDAeHA7LvdmAOsOXcF4_5yg&s';
    
    // Update the first image (main image) or add to images array if empty
    if (product.images && product.images.length > 0) {
      product.images[0] = newImageUrl;
    } else {
      product.images = [newImageUrl];
    }
    
    // Save the updated product
    await product.save();
    
    console.log('✅ Product image updated successfully!');
    console.log(`Updated image URL: ${product.images[0]}`);
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error updating product image:', error);
    await mongoose.connection.close();
  }
}

updateTigerImage();