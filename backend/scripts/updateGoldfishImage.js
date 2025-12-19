import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

async function updateGoldfishImage() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Find the Goldfish product specifically
    const product = await Product.findOne({ 
      name: 'Goldfish'
    });
    
    if (!product) {
      console.log('Goldfish product not found');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`Found product: ${product.name}`);
    
    // Update the product with only your specific Goldfish image
    const images = [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8nRAKMcpLhmEdqOcSIu8MPUUsSQcOgUGCA&s'
    ];
    
    // Update the product with images
    await Product.findByIdAndUpdate(product._id, { images });
    
    console.log(`Updated product: ${product.name} with your Goldfish image only`);
    console.log('All done!');
    
    // Close the connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error updating product:', error);
    process.exit(1);
  }
}

// Run the script
updateGoldfishImage();