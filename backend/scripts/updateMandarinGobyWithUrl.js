import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

/**
 * Script to update the Mandarin Goby product with a specific image URL
 * Usage: node updateMandarinGobyWithUrl.js
 */

async function updateMandarinGobyWithUrl() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // The image URL you provided
    const imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyq4Q7YIC0XVChd722GKPM-9AyGMtehi694A&s';
    
    console.log(`Using image URL: ${imageUrl}`);
    
    // Find the Mandarin Goby product
    const product = await Product.findOne({ 
      name: 'Mandarin Goby', 
      category: 'Marine Fish' 
    });
    
    if (!product) {
      console.error('❌ Product "Mandarin Goby" not found in "Marine Fish" category');
      await mongoose.connection.close();
      process.exit(1);
    }
    
    console.log(`✅ Found product: ${product.name}`);
    
    // Update the product with the new image URL
    // Replace all existing images with the new one
    product.images = [imageUrl];
    
    // Save the updated product
    await product.save();
    
    console.log('✅ Product image updated successfully!');
    console.log(`📝 Product: ${product.name}`);
    console.log(`📁 Category: ${product.category}`);
    console.log(`🖼️  Images: ${product.images.length} (updated with your URL)`);
    console.log(`🔗 Image URL: ${product.images[0]}`);
    
    // Close the connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error updating product image:', error);
    process.exit(1);
  }
}

// Run the script
updateMandarinGobyWithUrl();