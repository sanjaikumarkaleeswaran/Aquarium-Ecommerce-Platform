import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import https from 'https';

// Load environment variables
dotenv.config();

// Function to check if image URL is accessible
function checkImageAccessibility(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => {
      resolve(false);
    });
  });
}

async function checkProductImages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Find the Aquarium Tank 20gal product
    const product = await Product.findOne({ name: 'Aquarium Tank 20gal' });
    
    if (!product) {
      console.log('Product not found');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`Product: ${product.name}`);
    console.log(`Category: ${product.category}`);
    console.log(`Images:`, product.images);
    
    // Check if the image URL is accessible
    if (product.images && product.images.length > 0) {
      const imageUrl = product.images[0];
      console.log(`\nTesting primary image URL: ${imageUrl}`);
      
      const isAccessible = await checkImageAccessibility(imageUrl);
      console.log(`Image accessible: ${isAccessible ? 'Yes' : 'No'}`);
      
      if (!isAccessible) {
        console.log('The image might be blocked or unavailable. Let me try to update with a more reliable image.');
        
        // Update with a more reliable image
        const fallbackImages = [
          'https://images.unsplash.com/photo-1595783580573-96e3cf0b4b8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          ...product.images.slice(1)
        ];
        
        await Product.findByIdAndUpdate(product._id, { images: fallbackImages });
        console.log('Updated product with fallback image');
      }
    }
    
    // Close the connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error checking product:', error);
    process.exit(1);
  }
}

// Run the script
checkProductImages();