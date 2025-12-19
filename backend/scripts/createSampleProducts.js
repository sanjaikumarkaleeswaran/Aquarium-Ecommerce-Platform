import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

async function createSampleProducts() {
    try {
        // First, find or create a wholesaler
        let wholesaler = await User.findOne({ role: 'wholesaler', isApproved: true });

        if (!wholesaler) {
            console.log('No approved wholesaler found. Creating one...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('wholesaler123', salt);

            wholesaler = new User({
                name: 'Ocean Wholesale',
                email: 'wholesaler@aquarium.com',
                password: hashedPassword,
                role: 'wholesaler',
                isApproved: true,
                approvalStatus: 'approved',
                businessName: 'Ocean Wholesale Inc',
                businessLicense: 'WHO123456',
                phone: '1234567890'
            });

            await wholesaler.save();
            console.log('Wholesaler created:', wholesaler.email);
        }

        // Sample products
        const sampleProducts = [
            {
                name: 'Marine Angelfish',
                category: 'Marine Fish',
                description: 'Beautiful marine angelfish with vibrant colors',
                priceWholesaler: 10,
                priceRetailer: 15,
                priceCustomer: 25,
                quantity: 100,
                fishType: 'marine',
                seller: wholesaler._id,
                sellerType: 'wholesaler'
            },
            {
                name: 'Neon Tetra',
                category: 'Fresh Water Fish',
                description: 'Small, colorful freshwater fish perfect for community tanks',
                priceWholesaler: 2,
                priceRetailer: 3,
                priceCustomer: 5,
                quantity: 200,
                fishType: 'soft',
                seller: wholesaler._id,
                sellerType: 'wholesaler'
            },
            {
                name: 'Clownfish',
                category: 'Marine Fish',
                description: 'Popular marine fish, great for beginners',
                priceWholesaler: 15,
                priceRetailer: 22,
                priceCustomer: 35,
                quantity: 80,
                fishType: 'marine',
                seller: wholesaler._id,
                sellerType: 'wholesaler'
            },
            {
                name: 'Goldfish',
                category: 'Fresh Water Fish',
                description: 'Classic freshwater fish, easy to care for',
                priceWholesaler: 3,
                priceRetailer: 5,
                priceCustomer: 8,
                quantity: 150,
                fishType: 'hard',
                seller: wholesaler._id,
                sellerType: 'wholesaler'
            },
            {
                name: '50 Gallon Aquarium Tank',
                category: 'Tanks',
                description: 'Large glass aquarium tank with LED lighting',
                priceWholesaler: 100,
                priceRetailer: 150,
                priceCustomer: 250,
                quantity: 30,
                seller: wholesaler._id,
                sellerType: 'wholesaler'
            },
            {
                name: '20 Gallon Nano Tank',
                category: 'Tanks',
                description: 'Perfect starter tank for small fish',
                priceWholesaler: 40,
                priceRetailer: 60,
                priceCustomer: 100,
                quantity: 50,
                seller: wholesaler._id,
                sellerType: 'wholesaler'
            },
            {
                name: 'Ceramic Planting Pots',
                category: 'Pots',
                description: 'Set of 3 ceramic pots for aquarium plants',
                priceWholesaler: 8,
                priceRetailer: 12,
                priceCustomer: 20,
                quantity: 100,
                seller: wholesaler._id,
                sellerType: 'wholesaler'
            },
            {
                name: 'Clay Hiding Pots',
                category: 'Pots',
                description: 'Natural clay pots for fish to hide',
                priceWholesaler: 5,
                priceRetailer: 8,
                priceCustomer: 12,
                quantity: 120,
                seller: wholesaler._id,
                sellerType: 'wholesaler'
            },
            {
                name: 'Anti-Parasite Medicine',
                category: 'Medicines',
                description: 'Effective treatment for common fish parasites',
                priceWholesaler: 12,
                priceRetailer: 18,
                priceCustomer: 30,
                quantity: 60,
                medicineType: 'treatment',
                seller: wholesaler._id,
                sellerType: 'wholesaler'
            },
            {
                name: 'Fish Vitamin Supplement',
                category: 'Medicines',
                description: 'Daily vitamin supplement for healthy fish',
                priceWholesaler: 8,
                priceRetailer: 12,
                priceCustomer: 20,
                quantity: 80,
                medicineType: 'supplement',
                seller: wholesaler._id,
                sellerType: 'wholesaler'
            },
            {
                name: 'Premium Fish Food Flakes',
                category: 'Foods',
                description: 'High-quality flake food for all fish types',
                priceWholesaler: 6,
                priceRetailer: 9,
                priceCustomer: 15,
                quantity: 200,
                seller: wholesaler._id,
                sellerType: 'wholesaler'
            },
            {
                name: 'Frozen Bloodworms',
                category: 'Foods',
                description: 'Nutritious frozen bloodworms for carnivorous fish',
                priceWholesaler: 10,
                priceRetailer: 15,
                priceCustomer: 25,
                quantity: 100,
                seller: wholesaler._id,
                sellerType: 'wholesaler'
            },
            {
                name: 'Artificial Coral Decoration',
                category: 'Decorative Items',
                description: 'Realistic artificial coral for marine tanks',
                priceWholesaler: 15,
                priceRetailer: 22,
                priceCustomer: 35,
                quantity: 40,
                accessoryType: 'stones',
                seller: wholesaler._id,
                sellerType: 'wholesaler'
            },
            {
                name: 'Decorative Castle',
                category: 'Decorative Items',
                description: 'Medieval castle decoration for aquariums',
                priceWholesaler: 12,
                priceRetailer: 18,
                priceCustomer: 30,
                quantity: 50,
                accessoryType: 'stones',
                seller: wholesaler._id,
                sellerType: 'wholesaler'
            },
            {
                name: 'Natural Driftwood',
                category: 'Decorative Items',
                description: 'Authentic driftwood for natural aquascaping',
                priceWholesaler: 20,
                priceRetailer: 30,
                priceCustomer: 50,
                quantity: 30,
                accessoryType: 'stones',
                seller: wholesaler._id,
                sellerType: 'wholesaler'
            }
        ];

        // Clear existing products (optional - comment out if you want to keep existing products)
        await Product.deleteMany({ seller: wholesaler._id });
        console.log('Cleared existing products');

        // Insert sample products
        const createdProducts = await Product.insertMany(sampleProducts);
        console.log(`✅ Created ${createdProducts.length} sample products!`);

        // Display summary
        console.log('\n📦 Product Summary:');
        console.log('-------------------');
        const categories = [...new Set(sampleProducts.map(p => p.category))];
        categories.forEach(category => {
            const count = sampleProducts.filter(p => p.category === category).length;
            console.log(`${category}: ${count} products`);
        });

        console.log('\n✅ Sample products created successfully!');
        console.log(`\n🔑 Wholesaler credentials:`);
        console.log(`   Email: ${wholesaler.email}`);
        console.log(`   Password: wholesaler123`);
        console.log(`\n💡 You can now login and view these products!`);

        process.exit(0);
    } catch (error) {
        console.error('Error creating sample products:', error);
        process.exit(1);
    }
}

createSampleProducts();
