// Script to check product quantities
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

async function checkQuantities() {
  try {
    console.log('Checking product quantities...\n');
    
    // Find all products and select only name and quantity
    const products = await Product.find({}, 'name category quantity priceCustomer');
    
    console.log(`Found ${products.length} products:\n`);
    
    let totalQuantity = 0;
    let lowStock = 0;
    let outOfStock = 0;
    let totalValue = 0;
    
    products.forEach(product => {
      const qty = product.quantity || 0;
      const price = product.priceCustomer || 0;
      
      totalQuantity += qty;
      totalValue += qty * price;
      
      if (qty === 0) {
        outOfStock++;
      } else if (qty < 10) {
        lowStock++;
      }
      
      console.log(`${product.name} (${product.category}): ${qty} units - ₹${price} each`);
    });
    
    console.log('\n--- SUMMARY ---');
    console.log(`Total Items: ${totalQuantity}`);
    console.log(`Low Stock Items (<10): ${lowStock}`);
    console.log(`Out of Stock Items (0): ${outOfStock}`);
    console.log(`Total Inventory Value: ₹${totalValue.toLocaleString()}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error checking quantities:', error);
    mongoose.connection.close();
  }
}

checkQuantities();