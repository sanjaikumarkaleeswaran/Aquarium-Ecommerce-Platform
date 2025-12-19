import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

async function verifyMandarinGobyImage() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Find the Mandarin Goby product
    const product = await Product.findOne({ 
      name: 'Mandarin Goby', 
      category: 'Marine Fish' 
    });
    
    if (product) {
      console.log('🔍 Product Verification:');
      console.log('=====================');
      console.log('Name:', product.name);
      console.log('Category:', product.category);
      console.log('Description:', product.description);
      console.log('Price (Customer):', product.priceCustomer);
      console.log('Price (Wholesaler):', product.priceWholesaler);
      console.log('Quantity:', product.quantity);
      console.log('Images:', product.images ? product.images.length : 0);
      
      if (product.images && product.images.length > 0) {
        // Check if it's still a placeholder image or a real image
        const imageUrl = product.images[0];
        if (imageUrl.includes('unsplash.com') || imageUrl.includes('placeholder')) {
          console.log('⚠️  Warning: Image still appears to be a placeholder');
          console.log('   Image URL preview:', imageUrl.substring(0, 60) + '...');
        } else if (imageUrl.startsWith('data:image')) {
          console.log('✅ Success: Product has a real image (base64 encoded)');
          console.log('   Image size: ~', Math.round(imageUrl.length / 1024), 'KB');
        } else {
          console.log('ℹ️  Info: Product has a custom image URL');
          console.log('   Image URL preview:', imageUrl.substring(0, 60) + '...');
        }
      } else {
        console.log('❌ Error: No images found for this product');
      }
      
      console.log('\n✅ Verification complete!');
    } else {
      console.log('❌ Product "Mandarin Goby" not found in "Marine Fish" category');
    }
    
    // Close the connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error verifying product image:', error);
    process.exit(1);
  }
}

// Run the script
verifyMandarinGobyImage();