// Script to get inventory details for all products
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

async function getInventoryDetails() {
  try {
    console.log('Getting inventory details for all products...\n');
    
    // Find all products
    const products = await Product.find({});
    
    console.log(`Found ${products.length} products in inventory:\n`);
    
    // Initialize counters
    let totalItems = 0;
    let lowStockItems = [];
    let outOfStockItems = [];
    let totalValue = 0;
    let categoryQuantities = {};
    
    // Process each product
    for (const product of products) {
      const quantity = product.quantity || 0;
      const price = product.priceCustomer || product.price || 0;
      const value = quantity * price;
      
      totalItems += quantity;
      totalValue += value;
      
      // Track category quantities
      if (!categoryQuantities[product.category]) {
        categoryQuantities[product.category] = 0;
      }
      categoryQuantities[product.category] += quantity;
      
      // Check for low stock (less than 10 units)
      if (quantity > 0 && quantity < 10) {
        lowStockItems.push({
          name: product.name,
          category: product.category,
          currentStock: quantity,
          reorderLevel: 10
        });
      }
      
      // Check for out of stock (0 units)
      if (quantity === 0) {
        outOfStockItems.push({
          name: product.name,
          category: product.category,
          currentStock: quantity,
          reorderLevel: 5
        });
      }
    }
    
    console.log(`Total Items: ${totalItems}`);
    console.log(`Low Stock Items: ${lowStockItems.length}`);
    console.log(`Out of Stock Items: ${outOfStockItems.length}`);
    console.log(`Total Inventory Value: ₹${totalValue.toLocaleString()}\n`);
    
    console.log('Category Distribution:');
    for (const [category, quantity] of Object.entries(categoryQuantities)) {
      console.log(`  ${category}: ${quantity} items`);
    }
    
    console.log('\nLow Stock Alerts:');
    if (lowStockItems.length > 0) {
      lowStockItems.forEach(item => {
        console.log(`  ${item.name} (${item.category}): ${item.currentStock} units (reorder at ${item.reorderLevel})`);
      });
    } else {
      console.log('  No low stock items');
    }
    
    console.log('\nOut of Stock Items:');
    if (outOfStockItems.length > 0) {
      outOfStockItems.forEach(item => {
        console.log(`  ${item.name} (${item.category}): ${item.currentStock} units`);
      });
    } else {
      console.log('  No out of stock items');
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error getting inventory details:', error);
    mongoose.connection.close();
  }
}

getInventoryDetails();