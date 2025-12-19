import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

async function updateOscarFishImage() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Find the Oscar Fish product specifically
    const product = await Product.findOne({ 
      name: 'Oscar Fish'
    });
    
    if (!product) {
      console.log('Oscar Fish product not found');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`Found product: ${product.name}`);
    
    // Update the product with only your specific Oscar Fish image
    const images = [
      'https://freshwateraquatica.org/cdn/shop/products/The-Complete-Oscar-Fish-Care-Guide-Types-Diet-Tankmates-Banner.jpg?v=1693570914&width=1946'
    ];
    
    // Update the product with images
    await Product.findByIdAndUpdate(product._id, { images });
    
    console.log(`Updated product: ${product.name} with your Oscar Fish image only`);
    console.log('All done!');
    
    // Close the connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error updating product:', error);
    process.exit(1);
  }
}

// Run the script
updateOscarFishImage();