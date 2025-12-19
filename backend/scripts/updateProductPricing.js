import mongoose from "mongoose";
import Product from "../models/Product.js";
import dotenv from "dotenv";

dotenv.config();

const updateProductPricing = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aquarium-commerce');
    console.log("Connected to MongoDB");

    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    let updatedCount = 0;
    
    // Update each product to ensure customer price is higher than wholesaler price
    for (const product of products) {
      let needsUpdate = false;
      
      // If wholesaler price is greater than or equal to customer price, adjust pricing
      if (product.priceWholesaler >= product.priceCustomer) {
        // Set wholesaler price to 80% of customer price (20% markup for customer)
        product.priceWholesaler = Math.round(product.priceCustomer * 0.8);
        needsUpdate = true;
        console.log(`Adjusted pricing for ${product.name}: Customer=${product.priceCustomer}, Wholesaler=${product.priceWholesaler}`);
      }
      
      // If either price is missing, set default values
      if (!product.priceCustomer || !product.priceWholesaler) {
        // Set default pricing based on category
        const defaultPrices = {
          "Marine Fish": { customer: 2000, wholesaler: 1600 },
          "Fresh Water Fish": { customer: 1500, wholesaler: 1200 },
          "Tanks": { customer: 3000, wholesaler: 2400 },
          "Pots": { customer: 500, wholesaler: 400 },
          "Decorative Items": { customer: 1000, wholesaler: 800 },
          "Foods": { customer: 500, wholesaler: 400 },
          "Medicines": { customer: 800, wholesaler: 640 }
        };
        
        const prices = defaultPrices[product.category] || { customer: 1000, wholesaler: 800 };
        product.priceCustomer = product.priceCustomer || prices.customer;
        product.priceWholesaler = product.priceWholesaler || prices.wholesaler;
        needsUpdate = true;
        console.log(`Set default pricing for ${product.name}: Customer=${product.priceCustomer}, Wholesaler=${product.priceWholesaler}`);
      }
      
      // Save the product if it was updated
      if (needsUpdate) {
        await product.save();
        updatedCount++;
      }
    }
    
    console.log(`Successfully updated pricing for ${updatedCount} products`);
    process.exit(0);
  } catch (error) {
    console.error("Error updating product pricing:", error);
    process.exit(1);
  }
};

updateProductPricing();