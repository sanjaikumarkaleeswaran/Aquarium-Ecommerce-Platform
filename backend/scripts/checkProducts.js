import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

async function checkProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    const products = await Product.find({});
    console.log('Products count:', products.length);
    
    products.forEach(p => {
      console.log(p.name, '-', p.category, '-', p.fishType || 'N/A');
    });
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkProducts();