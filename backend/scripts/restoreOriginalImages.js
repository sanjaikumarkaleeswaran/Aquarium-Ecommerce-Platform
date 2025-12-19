import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

/**
 * Script to restore original images for all products
 * This script will scan a folder structure and assign images to products based on name matching
 */

async function restoreOriginalImages(baseImagePath) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Check if base image folder exists
    if (!fs.existsSync(baseImagePath)) {
      console.error(`Base image folder ${baseImagePath} does not exist`);
      process.exit(1);
    }
    
    // Get all category folders
    const categories = fs.readdirSync(baseImagePath).filter(file => 
      fs.statSync(path.join(baseImagePath, file)).isDirectory()
    );
    
    console.log(`Found ${categories.length} categories:`, categories);
    
    let totalUpdated = 0;
    
    // Process each category
    for (const category of categories) {
      const categoryPath = path.join(baseImagePath, category);
      const files = fs.readdirSync(categoryPath);
      const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      });
      
      console.log(`\nProcessing category: ${category} (${imageFiles.length} images)`);
      
      // Process each image file in the category
      for (const fileName of imageFiles) {
        const filePath = path.join(categoryPath, fileName);
        // Extract product name from file name (remove extension)
        const productName = path.basename(fileName, path.extname(fileName));
        
        // Try to find existing product with exact name match (case insensitive)
        const existingProduct = await Product.findOne({
          name: { $regex: `^${productName}$`, $options: 'i' },
          category: category
        });
        
        if (existingProduct) {
          // Read and encode image file
          const imageData = fs.readFileSync(filePath, { encoding: 'base64' });
          const imageUri = `data:image/${path.extname(fileName).substring(1)};base64,${imageData}`;
          
          // Update the product with the original image
          await Product.findByIdAndUpdate(existingProduct._id, {
            images: [imageUri]
          });
          
          console.log(`✓ Updated product "${existingProduct.name}" with original image`);
          totalUpdated++;
        } else {
          console.log(`⚠ Product not found for image: ${fileName}`);
        }
      }
    }
    
    console.log(`\n✅ Successfully updated ${totalUpdated} products with original images`);
    
    // Close the connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error restoring original images:', error);
    process.exit(1);
  }
}

// Get command line arguments
const args = process.argv.slice(2);
if (args.length < 1) {
  console.log('Usage: node restoreOriginalImages.js <base-image-folder-path>');
  console.log('Example: node restoreOriginalImages.js ./original-images');
  process.exit(1);
}

const baseImagePath = args[0];

// Run the script
restoreOriginalImages(baseImagePath);