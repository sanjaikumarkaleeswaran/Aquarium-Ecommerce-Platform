import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

/**
 * Script to recover original products with their original images
 * This script will help restore products in categories other than fish
 */

async function recoverOriginalProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Categories to recover (excluding fish categories)
    const categoriesToRecover = [
      "Tanks", 
      "Pots", 
      "Foods", 
      "Decorative Items", 
      "Medicines"
    ];
    
    console.log(`Checking products in categories: ${categoriesToRecover.join(', ')}`);
    
    // Find all products in these categories
    const products = await Product.find({
      category: { $in: categoriesToRecover }
    });
    
    console.log(`Found ${products.length} products in target categories`);
    
    if (products.length === 0) {
      console.log('No products found in target categories');
      await mongoose.connection.close();
      return;
    }
    
    // Display information about products with images
    let productsWithImages = 0;
    for (const product of products) {
      if (product.images && product.images.length > 0) {
        productsWithImages++;
        console.log(`Product: ${product.name}`);
        console.log(`  Category: ${product.category}`);
        console.log(`  Images: ${product.images.length}`);
        console.log(`  First image preview: ${product.images[0].substring(0, 100)}...`);
        console.log('---');
      }
    }
    
    console.log(`Summary: ${productsWithImages} products have images in target categories`);
    
    // Close the connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error recovering products:', error);
    process.exit(1);
  }
}

// Run the script
recoverOriginalProducts();