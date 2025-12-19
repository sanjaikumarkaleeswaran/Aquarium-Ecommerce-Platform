// Script to test the three-tier pricing system
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

async function testThreeTierPricing() {
  try {
    console.log('Testing three-tier pricing system...\n');
    
    // Get all products
    const products = await Product.find({});
    
    console.log('Product Pricing Analysis:');
    console.log('========================\n');
    
    products.forEach(product => {
      const wholesalerPrice = product.priceWholesaler || product.price;
      const retailerPrice = product.priceRetailer || product.price;
      const customerPrice = product.priceCustomer || product.price;
      
      // Calculate margins
      const wholesalerToRetailerMargin = retailerPrice - wholesalerPrice;
      const retailerToCustomerMargin = customerPrice - retailerPrice;
      const totalProfit = customerPrice - wholesalerPrice;
      
      const wholesalerToRetailerMarginPercent = ((wholesalerToRetailerMargin / wholesalerPrice) * 100).toFixed(2);
      const retailerToCustomerMarginPercent = ((retailerToCustomerMargin / retailerPrice) * 100).toFixed(2);
      
      console.log(`Product: ${product.name}`);
      console.log(`  Category: ${product.category}`);
      console.log(`  Wholesaler Price: ₹${wholesalerPrice}`);
      console.log(`  Retailer Price: ₹${retailerPrice}`);
      console.log(`  Customer Price: ₹${customerPrice}`);
      console.log(`  Wholesaler-Retailer Margin: ₹${wholesalerToRetailerMargin} (${wholesalerToRetailerMarginPercent}%)`);
      console.log(`  Retailer-Customer Margin: ₹${retailerToCustomerMargin} (${retailerToCustomerMarginPercent}%)`);
      console.log(`  Total Potential Profit: ₹${totalProfit}`);
      console.log(`  Stock Quantity: ${product.quantity}`);
      console.log('----------------------------------------');
    });
    
    // Verify that all products have correct three-tier pricing
    console.log('\nValidation Results:');
    console.log('==================');
    
    let validProducts = 0;
    let invalidProducts = 0;
    
    products.forEach(product => {
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
      console.log('\n💰 Pricing Structure Summary:');
      console.log('   Wholesaler → Retailer → Customer');
      console.log('   (Lowest)   (Medium)   (Highest)');
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error testing three-tier pricing system:', error);
    mongoose.connection.close();
  }
}

testThreeTierPricing();