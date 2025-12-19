import mongoose from 'mongoose';
import User from './models/User.js';
import RetailerProduct from './models/RetailerProduct.js';
import dotenv from 'dotenv';

dotenv.config();

const checkProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const retailers = await User.find({ role: 'retailer' });
        console.log(`Found ${retailers.length} retailers`);

        for (const retailer of retailers) {
            console.log(`Checking retailer: ${retailer.name} (${retailer._id})`);
            const products = await RetailerProduct.find({ retailer: retailer._id });
            console.log(`- RetailerProducts count: ${products.length}`);
            if (products.length > 0) {
                console.log('- First product:', products[0].name);
            }
        }

        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkProducts();
