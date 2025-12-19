// Script to add retailer pricing to existing products
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Configure dotenv
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aquarium-commerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

import Product from '../models/Product.js';

async function addRetailerPricing() {
  try {
    console.log('Adding retailer pricing to products...\n');
    
    // Get all products
    const products = await Product.find({});
    
    console.log(`Found ${products.length} products to update.\n`);
    
    let updatedCount = 0;
    
    for (const product of products) {
      // Calculate retailer price as midpoint between wholesaler and customer prices
      const wholesalerPrice = product.priceWholesaler || product.price;
      const customerPrice = product.priceCustomer || product.price;
      
      // If retailer price is missing, calculate it as midpoint
      if (!product.priceRetailer) {
        const retailerPrice = Math.round((wholesalerPrice + customerPrice) / 2);
        
        // Update the product with the new retailer price
        await Product.findByIdAndUpdate(product._id, {
          priceRetailer: retailerPrice
        });
        
        console.log(`Updated ${product.name}:`);
        console.log(`  Wholesaler Price: ₹${wholesalerPrice}`);
        console.log(`  Retailer Price: ₹${retailerPrice}`);
        console.log(`  Customer Price: ₹${customerPrice}`);
        console.log('----------------------------------------');
        
        updatedCount++;
      }
    }
    
    console.log(`\n✅ Successfully updated ${updatedCount} products with retailer pricing!`);
    
    // Verify the updates
    console.log('\nVerifying pricing structure...');
    const updatedProducts = await Product.find({});
    
    let validProducts = 0;
    let invalidProducts = 0;
    
    updatedProducts.forEach(product => {
      const wholesalerPrice = product.priceWholesaler || product.price;
      const retailerPrice = product.priceRetailer || product.price;
      const customerPrice = product.priceCustomer || product.price;
      
      // Check if pricing follows wholesaler < retailer < customer
      if (wholesalerPrice <= retailerPrice && retailerPrice <= customerPrice) {
        validProducts++;
      } else {
        invalidProducts++;
        console.log(`❌ Invalid pricing for ${product.name}:`);
        console.log(`   Wholesaler: ₹${wholesalerPrice}, Retailer: ₹${retailerPrice}, Customer: ₹${customerPrice}`);
      }
    });
    
    console.log(`\n✅ Valid products: ${validProducts}`);
    console.log(`❌ Invalid products: ${invalidProducts}`);
    
    if (invalidProducts === 0) {
      console.log('\n🎉 All products have correct three-tier pricing!');
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error adding retailer pricing:', error);
    mongoose.connection.close();
  }
}

addRetailerPricing();