import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import fs from 'fs';

dotenv.config();

/**
 * Script to update the image for the Mandarin Goby product
 * Usage: node updateMandarinGobyImage.js <image-file-path>
 */

async function updateMandarinGobyImage(imagePath) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Check if image file exists
    if (!fs.existsSync(imagePath)) {
      console.error(`❌ Image file not found: ${imagePath}`);
      process.exit(1);
    }
    
    // Verify it's an image file
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = imagePath.substring(imagePath.lastIndexOf('.')).toLowerCase();
    
    if (!allowedExtensions.includes(ext)) {
      console.error(`❌ Invalid file type. Supported formats: ${allowedExtensions.join(', ')}`);
      process.exit(1);
    }
    
    console.log(`✅ Found image file: ${imagePath}`);
    
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
    
    // Read and encode the image file
    const imageData = fs.readFileSync(imagePath, { encoding: 'base64' });
    const imageUri = `data:image/${ext.substring(1)};base64,${imageData}`;
    
    console.log('✅ Image encoded successfully');
    
    // Update the product with the new image
    // Replace all existing images with the new one
    product.images = [imageUri];
    
    // Save the updated product
    await product.save();
    
    console.log('✅ Product image updated successfully!');
    console.log(`📝 Product: ${product.name}`);
    console.log(`📁 Category: ${product.category}`);
    console.log(`🖼️  Images: ${product.images.length} (replaced with your image)`);
    
    // Close the connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error updating product image:', error);
    process.exit(1);
  }
}

// Get command line arguments
const args = process.argv.slice(2);
if (args.length < 1) {
  console.log('Usage: node updateMandarinGobyImage.js <image-file-path>');
  console.log('Example: node updateMandarinGobyImage.js ./mandarin-goby.jpg');
  process.exit(1);
}

const imagePath = args[0];

// Run the script
updateMandarinGobyImage(imagePath);