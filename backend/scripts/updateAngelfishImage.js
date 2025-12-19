import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

async function updateAngelfishImage() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Find the Angelfish product
    const product = await Product.findOne({ name: 'Angelfish' });
    
    if (!product) {
      console.log('Angelfish product not found');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`Found product: ${product.name}`);
    console.log(`Current images: ${product.images}`);
    
    // Update the image URL
    const newImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Group_of_Pterophyllum_Altum.jpg/330px-Group_of_Pterophyllum_Altum.jpg';
    
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

updateAngelfishImage();