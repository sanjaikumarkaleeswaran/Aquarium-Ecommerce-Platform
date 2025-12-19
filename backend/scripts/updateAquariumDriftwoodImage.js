import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

async function updateAquariumDriftwoodImage() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Find the Aquarium Driftwood product
    const product = await Product.findOne({ name: 'Aquarium Driftwood' });
    
    if (!product) {
      console.log('Aquarium Driftwood product not found');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`Found product: ${product.name}`);
    console.log(`Current images: ${product.images}`);
    
    // Update with the specific image URL you provided
    const newImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWn6LkU5ijY8wXE8zfx33gjtAc5tf7D9RR4A&s';
    
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
    console.error('Error updating Aquarium Driftwood image:', error);
    process.exit(1);
  }
}

// Run the script
updateAquariumDriftwoodImage();