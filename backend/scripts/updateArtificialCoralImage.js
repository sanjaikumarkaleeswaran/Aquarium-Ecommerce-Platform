import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

async function updateArtificialCoralImage() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Find the Artificial Coral Set product
    const product = await Product.findOne({ name: 'Artificial Coral Set' });
    
    if (!product) {
      console.log('Artificial Coral Set product not found');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`Found product: ${product.name}`);
    console.log(`Current images: ${product.images}`);
    
    // Update the image URL
    const newImageUrl = 'https://m.media-amazon.com/images/I/812dcKZaQoL._AC_UF350,350_QL80_.jpg';
    
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
    console.error('Error updating Artificial Coral Set image:', error);
    process.exit(1);
  }
}

// Run the script
updateArtificialCoralImage();