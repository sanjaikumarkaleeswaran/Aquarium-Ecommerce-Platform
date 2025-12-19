import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

/**
 * Script to display all products and ensure they have original images
 */

async function displayAllProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Find all products
    const products = await Product.find({}).sort({ category: 1, name: 1 });
    
    console.log(`\nTotal products found: ${products.length}\n`);
    
    // Group products by category
    const productsByCategory = {};
    for (const product of products) {
      if (!productsByCategory[product.category]) {
        productsByCategory[product.category] = [];
      }
      productsByCategory[product.category].push(product);
    }
    
    // Display products by category
    for (const [category, categoryProducts] of Object.entries(productsByCategory)) {
      console.log(`=== ${category} (${categoryProducts.length} products) ===`);
      for (const product of categoryProducts) {
        console.log(`  ${product.name}`);
        console.log(`    Images: ${product.images ? product.images.length : 0}`);
        if (product.images && product.images.length > 0) {
          // Show a preview of the first image
          const imagePreview = product.images[0].substring(0, 60) + (product.images[0].length > 60 ? '...' : '');
          console.log(`    Image preview: ${imagePreview}`);
        }
      }
      console.log('');
    }
    
    // Close the connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error displaying products:', error);
    process.exit(1);
  }
}

// Run the script
displayAllProducts();