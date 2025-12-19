import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

async function verifyAquariumDriftwoodImage() {
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
    
    console.log(`Product: ${product.name}`);
    console.log(`Category: ${product.category}`);
    console.log(`Current images: ${product.images}`);
    
    // Check if the image was updated correctly
    const expectedImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWn6LkU5ijY8wXE8zfx33gjtAc5tf7D9RR4A&s';
    
    if (product.images && product.images.length > 0 && product.images[0] === expectedImageUrl) {
      console.log('✅ Image successfully updated!');
    } else {
      console.log('❌ Image was not updated correctly.');
      console.log(`Expected: ${expectedImageUrl}`);
      console.log(`Actual: ${product.images ? product.images[0] : 'No images'}`);
    }
    
    // Close the connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error verifying Aquarium Driftwood image:', error);
    process.exit(1);
  }
}

// Run the script
verifyAquariumDriftwoodImage();