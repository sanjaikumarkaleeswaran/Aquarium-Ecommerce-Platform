import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

async function updateMedicineImage() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Find medicine products specifically
    const products = await Product.find({ 
      category: 'medicine'
    });
    
    console.log(`Found ${products.length} medicine products:`);
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.category})`);
    });
    
    // Use the first medicine product
    let targetProduct = products[0];
    
    if (!targetProduct) {
      console.log('No medicine products found');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`\nUpdating product: ${targetProduct.name}`);
    
    // Update the product with only your specific medicine image
    const images = [
      'https://onyxaqua.com/wp-content/uploads/2025/09/Aqua-Cure-Yellow-Anti-Sep-50-ml-Fish-Medicine-3.jpg'
    ];
    
    // Update the product with images
    await Product.findByIdAndUpdate(targetProduct._id, { images });
    
    console.log(`Updated product: ${targetProduct.name} with your medicine image only`);
    console.log('All done!');
    
    // Close the connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error updating product:', error);
    process.exit(1);
  }
}

// Run the script
updateMedicineImage();