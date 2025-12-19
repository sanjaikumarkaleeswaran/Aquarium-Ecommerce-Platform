import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

async function updateTigerBarbSpecificImage() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Find the Tiger Barb product
    const product = await Product.findOne({ name: 'Tiger Barb' });
    
    if (!product) {
      console.log('Tiger Barb product not found');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`Found product: ${product.name}`);
    console.log(`Current images: ${product.images}`);
    
    // Update with your specific image URL
    const newImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFURX48kzvAiBP_cAJnAyWAapcg0UWRqdUFQ&s';
    
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
    console.error('Error updating Tiger Barb image:', error);
    process.exit(1);
  }
}

// Run the script
updateTigerBarbSpecificImage();