import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

async function updateReefTankImage() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Find the Large Reef Tank 100gal product
    const product = await Product.findOne({ name: 'Large Reef Tank 100gal' });
    
    if (!product) {
      console.log('Large Reef Tank 100gal product not found');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`Found product: ${product.name}`);
    console.log(`Current images: ${product.images}`);
    
    // Update the image URL
    const newImageUrl = 'https://aquariumdepot.ca/cdn/shop/products/Innovative_Marine_100_INT_Complete_Reef_System-Black.jpg?v=1677384635';
    
    // Update the first image (main image) or add to images array if empty
    if (product.images && product.images.length > 0) {
      product.images[0] = newImageUrl;
    } else {
      product.images = [newImageUrl];
    }
    
    // Save the updated product
    await product.save();
    
    console.log(`Successfully updated image for ${product.name}`);
    console.log(`New image URL: ${product.images[0]}`);
    
    // Close the connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error updating Large Reef Tank image:', error);
    process.exit(1);
  }
}

// Run the script
updateReefTankImage();