import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

async function checkCurrentProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Get all products
    const products = await Product.find({});
    
    console.log(`Found ${products.length} products in the database:`);
    
    // Group products by category
    const categories = {};
    products.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = [];
      }
      categories[product.category].push(product);
    });
    
    // Display products by category
    Object.entries(categories).forEach(([category, categoryProducts]) => {
      console.log(`\n${category} (${categoryProducts.length} products):`);
      
      // For fish categories, also group by fishType
      if (category === 'Marine Fish' || category === 'Fresh Water Fish') {
        const fishTypes = {};
        categoryProducts.forEach(product => {
          const type = product.fishType || 'N/A';
          if (!fishTypes[type]) {
            fishTypes[type] = [];
          }
          fishTypes[type].push(product);
        });
        
        Object.entries(fishTypes).forEach(([fishType, fishProducts]) => {
          console.log(`  ${category} (${fishType}):`);
          fishProducts.forEach(product => {
            console.log(`    - ${product.name} (ID: ${product._id})`);
          });
        });
      } else {
        // For non-fish categories, just list the products
        categoryProducts.forEach(product => {
          console.log(`  - ${product.name} (ID: ${product._id})`);
        });
      }
    });
    
    // Close the connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error checking products:', error);
    process.exit(1);
  }
}

// Run the script
checkCurrentProducts();