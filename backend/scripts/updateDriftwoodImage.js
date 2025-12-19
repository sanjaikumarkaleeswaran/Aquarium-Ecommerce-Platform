import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

async function updateDriftwoodImage() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Find driftwood/decorative products specifically
    const products = await Product.find({ 
      name: { $regex: /driftwood/i }
    });
    
    console.log(`Found ${products.length} driftwood products:`);
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.category})`);
    });
    
    // Use the first driftwood product
    let targetProduct = products[0];
    
    if (!targetProduct) {
      console.log('No driftwood products found');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`\nUpdating product: ${targetProduct.name}`);
    
    // Update the product with only your specific driftwood image
    const images = [
      'https://images-cdn.ubuy.co.in/63503b41ce31743a296b79d4-oruuum-8-pack-4-34-6-34.jpg'
    ];
    
    // Update the product with images
    await Product.findByIdAndUpdate(targetProduct._id, { images });
    
    console.log(`Updated product: ${targetProduct.name} with your driftwood image only`);
    console.log('All done!');
    
    // Close the connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error updating product:', error);
    process.exit(1);
  }
}

// Run the script
updateDriftwoodImage();