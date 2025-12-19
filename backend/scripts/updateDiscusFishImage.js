import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

async function updateDiscusFishImage() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Find the Discus Fish product specifically
    const product = await Product.findOne({ 
      name: 'Discus Fish'
    });
    
    if (!product) {
      console.log('Discus Fish product not found');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`Found product: ${product.name}`);
    
    // Update the product with only your specific Discus Fish image
    const images = [
      'https://media.istockphoto.com/id/450612461/photo/aquarium-displaying-two-tropical-fish-symphsodon-discus.jpg?s=612x612&w=0&k=20&c=tMLaAMBBm_Tm7w7N8RjbPVE84foCFvBWe9-6F2FbNDQ='
    ];
    
    // Update the product with images
    await Product.findByIdAndUpdate(product._id, { images });
    
    console.log(`Updated product: ${product.name} with your Discus Fish image only`);
    console.log('All done!');
    
    // Close the connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error updating product:', error);
    process.exit(1);
  }
}

// Run the script
updateDiscusFishImage();