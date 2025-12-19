import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

async function updateNeonTetraImage() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Find the Neon Tetra product specifically
    const product = await Product.findOne({ 
      name: 'Neon Tetra'
    });
    
    if (!product) {
      console.log('Neon Tetra product not found');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`Found product: ${product.name}`);
    
    // Update the product with only your specific Neon Tetra image
    const images = [
      'https://fish.splashyfin.com/wp-content/uploads/2022/10/neon-tetra-2.jpeg'
    ];
    
    // Update the product with images
    await Product.findByIdAndUpdate(product._id, { images });
    
    console.log(`Updated product: ${product.name} with your Neon Tetra image only`);
    console.log('All done!');
    
    // Close the connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error updating product:', error);
    process.exit(1);
  }
}

// Run the script
updateNeonTetraImage();