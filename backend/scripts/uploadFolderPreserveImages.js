#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

/**
 * Script to upload images from a folder while preserving existing images
 * Usage: node uploadFolderPreserveImages.js <folder-path> <category>
 * 
 * This script preserves original images by:
 * 1. Checking if a product with the same name already exists
 * 2. If found, reusing the existing images for ALL categories (not just fish)
 * 3. If not found, creating a new product with the provided image
 * 4. Supporting common image formats: JPG, JPEG, PNG, GIF, WEBP
 */

async function uploadFolderPreserveImages(folderPath, category) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Check if folder exists
    if (!fs.existsSync(folderPath)) {
      console.error(`Folder ${folderPath} does not exist`);
      process.exit(1);
    }
    
    // Read all files from the folder
    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });
    
    console.log(`Found ${imageFiles.length} image files in folder`);
    
    if (imageFiles.length === 0) {
      console.log('No image files found in folder');
      await mongoose.connection.close();
      return;
    }
    
    // Process each image file
    for (let i = 0; i < imageFiles.length; i++) {
      const fileName = imageFiles[i];
      const filePath = path.join(folderPath, fileName);
      
      // Extract product name from file name (remove extension)
      const productName = path.basename(fileName, path.extname(fileName));
      
      // Try to find existing product with exact name match
      // Reuse existing images for all categories including fish
      const existingProduct = await Product.findOne({
        name: { $regex: `^${productName}$`, $options: 'i' },
        category: category
      });
      
      if (existingProduct) {
        // Product exists - reuse existing images for all categories
        console.log(`🔄 Product "${productName}" already exists with ${existingProduct.images?.length || 0} images. Reusing original images for all categories.`);
        
        // Update the existing product with any new information except images
        const updateData = {
          description: `Beautiful ${productName} for your aquarium`,
          priceCustomer: Math.floor(Math.random() * 100) + 10, // Random price for demo
          priceWholesaler: Math.floor(Math.random() * 50) + 5, // Random wholesale price
          quantity: Math.floor(Math.random() * 50) + 10, // Random quantity
          category: category
          // Note: Not updating images to preserve originals
        };
        
        await Product.findByIdAndUpdate(existingProduct._id, updateData);
        console.log(`✅ Reused original images for product: ${existingProduct.name}`);
      } else {
        // Product doesn't exist - create new product with image
        console.log(`🆕 Creating new product for: ${productName}`);
        
        // Read and encode image file
        const imageData = fs.readFileSync(filePath, { encoding: 'base64' });
        const imageUri = `data:image/${path.extname(fileName).substring(1)};base64,${imageData}`;
        
        // Create new product
        const newProduct = new Product({
          name: productName,
          category: category,
          description: `Beautiful ${productName} for your aquarium`,
          priceCustomer: Math.floor(Math.random() * 100) + 10, // Random price for demo
          priceWholesaler: Math.floor(Math.random() * 50) + 5, // Random wholesale price
          seller: null, // Would need to be set to actual wholesaler ID
          quantity: Math.floor(Math.random() * 50) + 10, // Random quantity
          images: [imageUri]
        });
        
        await newProduct.save();
        console.log(`✅ Created new product: ${productName} with image`);
      }
    }
    
    console.log('Folder upload processing completed!');
    
    // Close the connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error processing folder upload:', error);
    process.exit(1);
  }
}

// Get command line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: node uploadFolderPreserveImages.js <folder-path> <category>');
  console.log('Example: node uploadFolderPreserveImages.js ./images "Marine Fish"');
  process.exit(1);
}

const folderPath = args[0];
const category = args[1];

// Validate category
const validCategories = ["Marine Fish", "Fresh Water Fish", "Tanks", "Pots", "Medicines", "Foods", "Decorative Items"];
if (!validCategories.includes(category)) {
  console.error(`Invalid category. Valid categories: ${validCategories.join(', ')}`);
  process.exit(1);
}

// Run the script
uploadFolderPreserveImages(folderPath, category);