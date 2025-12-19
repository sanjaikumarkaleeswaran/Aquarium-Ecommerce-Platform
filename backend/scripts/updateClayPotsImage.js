import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

async function updateClayPotsImage() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Find the Aquarium Clay Pots product
    const product = await Product.findOne({ name: 'Aquarium Clay Pots' });
    
    if (!product) {
      console.log('Aquarium Clay Pots product not found');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`Found product: ${product.name}`);
    console.log(`Current images: ${product.images}`);
    
    // Update the image URL
    const newImageUrl = 'https://m.media-amazon.com/images/I/71rYcQKft3L._AC_UF1000,1000_QL80_.jpg';
    
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

updateClayPotsImage();