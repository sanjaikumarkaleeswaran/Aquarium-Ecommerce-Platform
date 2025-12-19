import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

// Image URLs for different categories
const categoryImages = {
  'Marine Fish': [
    'https://images.unsplash.com/photo-1544783745-9b0c9c0d4e3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1532027352178-19b1b3a6d9c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  ],
  'Fresh Water Fish': [
    'https://images.unsplash.com/photo-1544787280-7a5e3b3f8a8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1598270370202-44952b400d8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  ],
  'Tanks': [
    'https://images.unsplash.com/photo-1595783580573-96e3cf0b4b8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  ],
  'Pots': [
    'https://images.unsplash.com/photo-1609894851186-94a56e30b0d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  ],
  'Medicines': [
    'https://images.unsplash.com/photo-1544787280-7a5e3b3f8a8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  ],
  'Foods': [
    'https://images.unsplash.com/photo-1544787280-7a5e3b3f8a8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  ],
  'Decorative Items': [
    'https://images.unsplash.com/photo-1609894851186-94a56e30b0d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  ]
};

// Function to get appropriate image for a product based on its category
function getImageForProduct(product) {
  // If product already has images, reuse them
  if (product.images && product.images.length > 0) {
    console.log(`Reusing original ${product.images.length} images for product: ${product.name}`);
    return product.images;
  }
  
  // Get images based on category
  const category = product.category;
  const images = categoryImages[category] || [
    'https://images.unsplash.com/photo-1544787280-7a5e3b3f8a8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  ]; // Default image
  
  return images;
}

async function ensureAllProductsHaveImages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Get all products
    const products = await Product.find({});
    
    console.log(`Found ${products.length} products`);
    
    if (products.length === 0) {
      console.log('No products found in database');
      await mongoose.connection.close();
      return;
    }
    
    // Update each product with appropriate images
    let updatedCount = 0;
    for (const product of products) {
      const images = getImageForProduct(product);
      
      // Check if the product already has these images
      const hasSameImages = product.images && 
                           product.images.length === images.length && 
                           product.images.every((img, index) => img === images[index]);
      
      if (!hasSameImages) {
        // Update the product with images
        await Product.findByIdAndUpdate(product._id, { images });
        
        console.log(`Updated product: ${product.name} with ${images.length} images`);
        updatedCount++;
      } else {
        console.log(`Product: ${product.name} already has correct images`);
      }
    }
    
    console.log(`Successfully updated ${updatedCount} products with images!`);
    
    // Close the connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error updating products:', error);
    process.exit(1);
  }
}

// Run the script
ensureAllProductsHaveImages();