import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

/**
 * Script to consolidate duplicate products and preserve original images
 * This script finds products with the same name in the same category and keeps the ones with images
 */

async function consolidateProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Categories to process (excluding fish categories as requested)
    const categoriesToProcess = [
      "Tanks", 
      "Pots", 
      "Foods", 
      "Decorative Items", 
      "Medicines"
    ];
    
    console.log(`Processing products in categories: ${categoriesToProcess.join(', ')}`);
    
    // Process each category
    for (const category of categoriesToProcess) {
      console.log(`\nProcessing category: ${category}`);
      
      // Find all products in this category
      const products = await Product.find({ category: category }).sort({ createdAt: 1 });
      
      if (products.length === 0) {
        console.log(`  No products found in category ${category}`);
        continue;
      }
      
      console.log(`  Found ${products.length} products in category ${category}`);
      
      // Group products by name
      const productsByName = {};
      for (const product of products) {
        if (!productsByName[product.name]) {
          productsByName[product.name] = [];
        }
        productsByName[product.name].push(product);
      }
      
      // Process each group of products with the same name
      for (const [productName, productGroup] of Object.entries(productsByName)) {
        if (productGroup.length > 1) {
          console.log(`    Found ${productGroup.length} duplicates for product: ${productName}`);
          
          // Find the product with images (prefer the one with more images)
          let productWithMostImages = productGroup[0];
          for (const product of productGroup) {
            if (product.images && product.images.length > (productWithMostImages.images ? productWithMostImages.images.length : 0)) {
              productWithMostImages = product;
            }
          }
          
          console.log(`    Keeping product with ${productWithMostImages.images ? productWithMostImages.images.length : 0} images`);
          
          // Delete the other products
          for (const product of productGroup) {
            if (product._id.toString() !== productWithMostImages._id.toString()) {
              console.log(`    Deleting duplicate product: ${product.name} (${product._id})`);
              await Product.findByIdAndDelete(product._id);
            }
          }
        }
      }
    }
    
    console.log('\nConsolidation completed!');
    
    // Close the connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error consolidating products:', error);
    process.exit(1);
  }
}

// Run the script
consolidateProducts();