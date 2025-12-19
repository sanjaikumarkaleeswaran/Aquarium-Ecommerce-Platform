import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

async function checkAllCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Get all unique categories
    const categories = await Product.distinct('category');
    console.log('All categories in the database:', categories);
    
    // Check each category
    for (const category of categories) {
      const products = await Product.find({ category: category });
      console.log(`\n${category}: ${products.length} products`);
      
      if (products.length > 0) {
        // Show first few products as examples
        products.slice(0, 3).forEach(product => {
          console.log(`  - ${product.name} (ID: ${product._id})`);
        });
        if (products.length > 3) {
          console.log(`  ... and ${products.length - 3} more`);
        }
      }
    }
    
    // Also check for any products with empty categories
    const productsWithEmptyCategory = await Product.find({ category: { $in: [null, "", undefined] } });
    if (productsWithEmptyCategory.length > 0) {
      console.log(`\nProducts with empty categories: ${productsWithEmptyCategory.length}`);
      productsWithEmptyCategory.forEach(product => {
        console.log(`  - ${product.name} (ID: ${product._id})`);
      });
    }
    
    // Close the connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error checking categories:', error);
    process.exit(1);
  }
}

// Run the script
checkAllCategories();