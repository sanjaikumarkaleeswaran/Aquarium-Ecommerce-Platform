import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

/**
 * Script to remove duplicate products while preserving the ones with original images
 */

async function removeDuplicateProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Find all products
    const products = await Product.find({}).sort({ category: 1, name: 1, createdAt: 1 });
    
    console.log(`Total products found: ${products.length}`);
    
    // Group products by category and name
    const productGroups = {};
    for (const product of products) {
      const key = `${product.category}|${product.name}`;
      if (!productGroups[key]) {
        productGroups[key] = [];
      }
      productGroups[key].push(product);
    }
    
    // Count duplicates
    let duplicatesRemoved = 0;
    
    // Process each group
    for (const [key, group] of Object.entries(productGroups)) {
      if (group.length > 1) {
        console.log(`\nFound ${group.length} duplicates for: ${key}`);
        
        // Find the product with the most images
        let bestProduct = group[0];
        for (const product of group) {
          if (product.images && product.images.length > (bestProduct.images ? bestProduct.images.length : 0)) {
            bestProduct = product;
          }
        }
        
        console.log(`Keeping product with ${bestProduct.images ? bestProduct.images.length : 0} images: ${bestProduct.name}`);
        
        // Remove the other products
        for (const product of group) {
          if (product._id.toString() !== bestProduct._id.toString()) {
            console.log(`  Removing duplicate: ${product.name} (${product._id})`);
            await Product.findByIdAndDelete(product._id);
            duplicatesRemoved++;
          }
        }
      }
    }
    
    console.log(`\nRemoved ${duplicatesRemoved} duplicate products`);
    
    // Close the connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error removing duplicate products:', error);
    process.exit(1);
  }
}

// Run the script
removeDuplicateProducts();