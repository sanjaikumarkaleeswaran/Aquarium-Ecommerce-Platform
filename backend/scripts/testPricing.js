// Script to test the dual pricing system
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configure dotenv
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aquarium-commerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

import Product from '../models/Product.js';

async function testPricing() {
  try {
    console.log('Testing dual pricing system...\n');
    
    // Get all products
    const products = await Product.find({});
    
    console.log('Product Pricing Analysis:');
    console.log('========================\n');
    
    products.forEach(product => {
      const customerPrice = product.priceCustomer || product.price;
      const wholesalerPrice = product.priceWholesaler || product.price;
      const priceDifference = customerPrice - wholesalerPrice;
      const marginPercentage = ((priceDifference / wholesalerPrice) * 100).toFixed(2);
      
      console.log(`Product: ${product.name}`);
      console.log(`  Category: ${product.category}`);
      console.log(`  Wholesaler Price: ₹${wholesalerPrice}`);
      console.log(`  Customer Price: ₹${customerPrice}`);
      console.log(`  Price Difference: ₹${priceDifference} (${marginPercentage}%)`);
      console.log(`  Stock Quantity: ${product.quantity}`);
      console.log('----------------------------------------');
    });
    
    // Verify that all products have customer price >= wholesaler price
    console.log('\nValidation Results:');
    console.log('==================');
    
    let validProducts = 0;
    let invalidProducts = 0;
    
    products.forEach(product => {
      const customerPrice = product.priceCustomer || product.price;
      const wholesalerPrice = product.priceWholesaler || product.price;
      
      if (customerPrice >= wholesalerPrice) {
        validProducts++;
      } else {
        invalidProducts++;
        console.log(`❌ Invalid pricing for ${product.name}: Customer price (${customerPrice}) < Wholesaler price (${wholesalerPrice})`);
      }
    });
    
    console.log(`\n✅ Valid products: ${validProducts}`);
    console.log(`❌ Invalid products: ${invalidProducts}`);
    
    if (invalidProducts === 0) {
      console.log('\n🎉 All products have correct dual pricing!');
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error testing pricing system:', error);
    mongoose.connection.close();
  }
}

testPricing();