// Sample Product Data for Aquarium E-commerce Platform
// Run this script to populate the database with sample products

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';

dotenv.config();

// Sample Products Data
const sampleProducts = [
    {
        name: "Yellow Tang",
        category: "Marine Fish",
        description: "Beautiful bright yellow marine fish that adds vibrant color to any saltwater aquarium. Hardy and easy to care for, perfect for beginners. The Yellow Tang is one of the most popular marine aquarium fish due to its bright color and peaceful nature.",
        sku: "YT-001",
        wholesalePrice: 3000,
        suggestedRetailPrice: 4500,
        stock: 25,
        minimumOrderQuantity: 2,
        lowStockThreshold: 5,
        images: ["https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=800"],
        specifications: {
            dimensions: { unit: "cm", length: 8, width: 3, height: 4 },
            rating: 4.5,
            waterType: "Saltwater",
            temperament: "Peaceful",
            careLevel: "Easy",
            diet: "Herbivore"
        },
        tags: ["marine", "yellow", "tang", "beginner-friendly", "colorful"],
        isFeatured: true
    },
    {
        name: "Ocellaris Clownfish",
        category: "Marine Fish",
        description: "The famous orange and white striped clownfish. Hardy, easy to care for, and great for beginners. Symbiotic with anemones but can thrive without them.",
        sku: "OC-002",
        wholesalePrice: 1500,
        suggestedRetailPrice: 2500,
        stock: 40,
        minimumOrderQuantity: 2,
        lowStockThreshold: 10,
        images: ["https://images.unsplash.com/photo-1535591273668-9b9cc3c4143e?w=800"],
        specifications: {
            dimensions: { unit: "cm", length: 7, width: 2, height: 3 },
            rating: 5,
            waterType: "Saltwater",
            temperament: "Peaceful",
            careLevel: "Easy",
            diet: "Omnivore"
        },
        tags: ["clownfish", "nemo", "marine", "orange", "anemone"],
        isFeatured: true
    },
    {
        name: "Blue Tang (Dory)",
        category: "Marine Fish",
        description: "Beautiful blue surgeonfish made famous by Finding Nemo. Requires larger tanks and pristine water quality. Absolutely stunning in reef tanks.",
        sku: "BT-003",
        wholesalePrice: 5000,
        suggestedRetailPrice: 7500,
        stock: 15,
        minimumOrderQuantity: 1,
        lowStockThreshold: 5,
        images: ["https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=800"],
        specifications: {
            dimensions: { unit: "cm", length: 12, width: 4, height: 5 },
            rating: 4.2,
            waterType: "Saltwater",
            temperament: "Semi-Aggressive",
            careLevel: "Moderate",
            diet: "Herbivore"
        },
        tags: ["dory", "blue", "tang", "reef", "surgeonfish"],
        isFeatured: true
    },
    {
        name: "Betta Fish (Siamese Fighting Fish)",
        category: "Fresh Water Fish",
        description: "Colorful freshwater fish with flowing fins. Males must be kept separately. Easy to care for and perfect for small tanks. Available in many color variations.",
        sku: "BF-004",
        wholesalePrice: 150,
        suggestedRetailPrice: 300,
        stock: 100,
        minimumOrderQuantity: 5,
        lowStockThreshold: 20,
        images: ["https://images.unsplash.com/photo-1520990269283-eb5f598957ae?w=800"],
        specifications: {
            dimensions: { unit: "cm", length: 6, width: 2, height: 3 },
            rating: 4.8,
            waterType: "Freshwater",
            temperament: "Aggressive (Males)",
            careLevel: "Easy",
            diet: "Carnivore"
        },
        tags: ["betta", "siamese", "fighting fish", "colorful", "freshwater"],
        isFeatured: true
    },
    {
        name: "Goldfish (Fancy)",
        category: "Fresh Water Fish",
        description: "Classic ornamental fish with beautiful flowing fins. Hardy and long-lived with proper care. Great for beginners and children.",
        sku: "GF-005",
        wholesalePrice: 200,
        suggestedRetailPrice: 400,
        stock: 80,
        minimumOrderQuantity: 5,
        lowStockThreshold: 15,
        images: ["https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=800"],
        specifications: {
            dimensions: { unit: "cm", length: 12, width: 4, height: 5 },
            rating: 4.6,
            waterType: "Freshwater",
            temperament: "Peaceful",
            careLevel: "Easy",
            diet: "Omnivore"
        },
        tags: ["goldfish", "fancy", "freshwater", "classic", "beginner"],
        isFeatured: false
    },
    {
        name: "Aqua One 100L Glass Tank",
        category: "Tanks",
        description: "High-quality glass aquarium tank 100 liters capacity. Crystal clear glass with reinforced corners. Perfect for both freshwater and marine setups. Includes built-in filtration compartment.",
        sku: "TANK-100",
        wholesalePrice: 8000,
        suggestedRetailPrice: 12000,
        stock: 20,
        minimumOrderQuantity: 1,
        lowStockThreshold: 5,
        images: ["https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=800"],
        specifications: {
            dimensions: { unit: "cm", length: 80, width: 35, height: 40 },
            rating: 4.7,
            capacity: "100L",
            material: "Glass",
            thickness: "6mm"
        },
        tags: ["tank", "aquarium", "100 liter", "glass", "filtration"],
        isFeatured: true
    },
    {
        name: "LED Aquarium Light - Full Spectrum",
        category: "Aquarium Accessories",
        description: "Energy-efficient full-spectrum LED lighting for aquariums. Promotes plant growth and enhances fish colors. Timer function with sunrise/sunset modes.",
        sku: "LED-FS-001",
        wholesalePrice: 2500,
        suggestedRetailPrice: 4000,
        stock: 35,
        minimumOrderQuantity: 2,
        lowStockThreshold: 10,
        images: ["https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=800"],
        specifications: {
            dimensions: { unit: "cm", length: 90, width: 15, height: 2 },
            rating: 4.5,
            power: "45W",
            lifespan: "50000 hours",
            features: ["Timer", "Dimmer", "RGB"]
        },
        tags: ["LED", "lighting", "full spectrum", " plant growth", "timer"],
        isFeatured: false
    },
    {
        name: "Premium Fish Food Flakes - 500g",
        category: "Fish Food",
        description: "Nutritionally balanced flake food suitable for all tropical fish. Contains vitamins, minerals, and color enhancers. High protein formula for healthy growth.",
        sku: "FF-PREM-500",
        wholesalePrice: 400,
        suggestedRetailPrice: 800,
        stock: 150,
        minimumOrderQuantity: 10,
        lowStockThreshold: 30,
        images: ["https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=800"],
        specifications: {
            weight: "500g",
            rating: 4.8,
            protein: "45%",
            expiryMonths: 24,
            suitable: "All Tropical Fish"
        },
        tags: ["fish food", "flakes", "nutrition", "tropical", "premium"],
        isFeatured: false
    },
    {
        name: "Aqua Safe Water Conditioner - 500ml",
        category: "Water Treatment",
        description: "Instantly makes tap water safe for fish. Removes chlorine, chloramines, and heavy metals. Adds protective slime coat. Essential for every tank setup.",
        sku: "WC-AS-500",
        wholesalePrice: 300,
        suggestedRetailPrice: 600,
        stock: 100,
        minimumOrderQuantity: 5,
        lowStockThreshold: 20,
        images: ["https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=800"],
        specifications: {
            volume: "500ml",
            rating: 4.9,
            treats: "Upto 10000L",
            formula: "Concentrated",
            usage: "New setup & water changes"
        },
        tags: ["water conditioner", "chlorine remover", "safe water", "dechlorinator"],
        isFeatured: false
    },
    {
        name: "External Canister Filter 1200L/h",
        category: "Filters & Pumps",
        description: "Powerful external canister filter with multi-stage filtration. Quiet operation, includes filter media. Suitable for tanks up to 200 liters.",
        sku: "FIL-CAN-1200",
        wholesalePrice: 4500,
        suggestedRetailPrice: 7000,
        stock: 30,
        minimumOrderQuantity: 1,
        lowStockThreshold: 8,
        images: ["https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=800"],
        specifications: {
            dimensions: { unit: "cm", length: 25, width: 25, height: 40 },
            rating: 4.6,
            flowRate: "1200L/h",
            power: "25W",
            tankSize: "Up to 200L"
        },
        tags: ["filter", "canister", "external", "1200lph", "quiet"],
        isFeatured: true
    }
];

// Seed Database Function
async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aquarium-commerce');
        console.log('✅ Connected to MongoDB');

        // Find a wholesaler user (or create one if needed)
        let wholesaler = await User.findOne({ role: 'wholesaler' });

        if (!wholesaler) {
            console.log('⚠ No wholesaler found. Please create a wholesaler account first!');
            console.log('Or run this script after logging in as a wholesaler.');
            process.exit(1);
        }

        console.log(`📦 Found wholesaler: ${wholesaler.name || wholesaler.businessName}`);

        // Clear existing products (optional - comment out if you want to keep existing)
        // await Product.deleteMany({});
        // console.log('🗑 Cleared existing products');

        // Add wholesaler ID to all products
        const productsToInsert = sampleProducts.map(product => ({
            ...product,
            wholesaler: wholesaler._id,
            wholesalerName: wholesaler.businessName || wholesaler.name,
            mainImage: product.images[0],
            searchKeywords: product.tags
        }));

        // Insert products
        const insertedProducts = await Product.insertMany(productsToInsert);
        console.log(`✅ Successfully inserted ${insertedProducts.length} products`);

        // Display summary
        console.log('\n📊 Product Summary:');
        const categoryCounts = {};
        insertedProducts.forEach(p => {
            categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
        });
        Object.entries(categoryCounts).forEach(([category, count]) => {
            console.log(`   ${category}: ${count} products`);
        });

        console.log('\n🎉 Database seeding completed successfully!');
        console.log('You can now view products in the application.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seeding function
seedDatabase();
