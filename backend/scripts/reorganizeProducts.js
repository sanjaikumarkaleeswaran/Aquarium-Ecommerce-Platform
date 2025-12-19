import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Product data organized according to your exact specifications
const productCategories = [
  // 1. Marine Fishes (with hard and soft sub-types)
  {
    name: 'Blue Tang Fish',
    category: 'fish',
    fishType: 'marine',
    subType: 'hard',
    description: 'Vibrant blue tang fish with striking yellow tail, perfect for saltwater aquariums. Requires a minimum 30-gallon tank.',
    priceCustomer: 1950, // ₹1950 INR
    priceWholesaler: 1550, // ₹1550 INR
    quantity: 15,
    images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJEGTSPV6-ZIQVCGpNQR1LlCbCxEs2E9-ekaw4a27Imjf9gn6OJ6xYs8Q&s']
  },
  {
    name: 'Clown Fish',
    category: 'fish',
    fishType: 'marine',
    subType: 'soft',
    description: 'Bright orange clown fish with white stripes, pairs well with anemones. Perfect for beginner saltwater aquariums.',
    priceCustomer: 1450, // ₹1450 INR
    priceWholesaler: 1150, // ₹1150 INR
    quantity: 20,
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Amphiprion_ocellaris_%28Clown_anemonefish%29_by_Nick_Hobgood.jpg/250px-Amphiprion_ocellaris_%28Clown_anemonefish%29_by_Nick_Hobgood.jpg']
  },
  {
    name: 'Mandarin Goby',
    category: 'fish',
    fishType: 'marine',
    subType: 'soft',
    description: 'Small, peaceful reef-safe fish with beautiful blue and orange coloration. Requires well-established reef tanks with copepods for food.',
    priceCustomer: 2250, // ₹2250 INR
    priceWholesaler: 1750, // ₹1750 INR
    quantity: 12,
    images: ['https://images.unsplash.com/photo-1532027352178-19b1b3a6d9c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80']
  },
  
  // 2. Fresh Water Fishes (with hard and soft sub-types)
  {
    name: 'Goldfish',
    category: 'fish',
    fishType: 'hard',
    subType: 'hard',
    description: 'Classic golden fish, perfect for beginners and small freshwater aquariums. Can grow up to 12 inches.',
    priceCustomer: 450, // ₹450 INR
    priceWholesaler: 300, // ₹300 INR
    quantity: 30,
    images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8nRAKMcpLhmEdqOcSIu8MPUUsSQcOgUGCA&s']
  },
  {
    name: 'Oscar Fish',
    category: 'fish',
    fishType: 'hard',
    subType: 'hard',
    description: 'Large, intelligent cichlid with distinctive markings. Requires a 55+ gallon tank and experienced care.',
    priceCustomer: 1450, // ₹1450 INR
    priceWholesaler: 1100, // ₹1100 INR
    quantity: 12,
    images: ['https://freshwateraquatica.org/cdn/shop/products/The-Complete-Oscar-Fish-Care-Guide-Types-Diet-Tankmates-Banner.jpg?v=1693570914&width=1946']
  },
  {
    name: 'Red Tail Shark',
    category: 'fish',
    fishType: 'hard',
    subType: 'hard',
    description: 'Striking freshwater fish with a black body and bright red tail. Semi-aggressive and requires a spacious tank.',
    priceCustomer: 850, // ₹850 INR
    priceWholesaler: 650, // ₹650 INR
    quantity: 15,
    images: ['https://images.unsplash.com/photo-1532027352178-19b1b3a6d9c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80']
  },
  {
    name: 'Neon Tetra',
    category: 'fish',
    fishType: 'soft',
    subType: 'soft',
    description: 'Small, vibrant blue and red schooling fish. Best kept in groups of 6 or more in planted tanks.',
    priceCustomer: 300, // ₹300 INR
    priceWholesaler: 190, // ₹190 INR
    quantity: 50,
    images: ['https://fish.splashyfin.com/wp-content/uploads/2022/10/neon-tetra-2.jpeg']
  },
  {
    name: 'Discus Fish',
    category: 'fish',
    fishType: 'soft',
    subType: 'soft',
    description: 'Beautiful disc-shaped fish with vibrant colors. Requires pristine water conditions and soft water.',
    priceCustomer: 2750, // ₹2750 INR
    priceWholesaler: 2200, // ₹2200 INR
    quantity: 8,
    images: ['https://media.istockphoto.com/id/450612461/photo/aquarium-displaying-two-tropical-fish-symphsodon-discus.jpg?s=612x612&w=0&k=20&c=tMLaAMBBm_Tm7w7N8RjbPVE84foCFvBWe9-6F2FbNDQ=']
  },
  {
    name: 'Angelfish',
    category: 'fish',
    fishType: 'soft',
    subType: 'soft',
    description: 'Elegant freshwater fish with a distinctive triangular shape. Peaceful but can be territorial during breeding.',
    priceCustomer: 950, // ₹950 INR
    priceWholesaler: 700, // ₹700 INR
    quantity: 18,
    images: ['https://images.unsplash.com/photo-1598270370202-44952b400d8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80']
  },
  
  // 3. Different Types of Tanks
  {
    name: 'Aquarium Tank 20gal',
    category: 'tanks',
    description: 'Clear glass aquarium tank with 20-gallon capacity, includes filtration system and LED lighting.',
    priceCustomer: 6750, // ₹6750 INR
    priceWholesaler: 5700, // ₹5700 INR
    quantity: 8,
    images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSLHxrm67aYM3D4uDlXoma7sDUwlG2Z7IJuw&s']
  },
  {
    name: 'Large Reef Tank 100gal',
    category: 'tanks',
    description: 'Professional-grade reef tank with integrated LED lighting, protein skimmer, and filtration system.',
    priceCustomer: 37500, // ₹37,500 INR
    priceWholesaler: 32250, // ₹32,250 INR
    quantity: 3,
    images: ['https://images.unsplash.com/photo-1595783580573-96e3cf0b4b8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80']
  },
  {
    name: 'Nano Aquarium 5gal',
    category: 'tanks',
    description: 'Compact desktop aquarium perfect for small spaces. Includes built-in filtration and LED lighting.',
    priceCustomer: 3750, // ₹3750 INR
    priceWholesaler: 2950, // ₹2950 INR
    quantity: 15,
    images: ['https://images.unsplash.com/photo-1595783580573-96e3cf0b4b8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80']
  },
  
  // 4. Pots
  {
    name: 'Ceramic Flower Pot Set',
    category: 'tank-decoratives',
    accessoryType: 'pots',
    description: 'Beautiful ceramic flower pots that provide hiding spots for fish and enhance tank aesthetics.',
    priceCustomer: 850, // ₹850 INR
    priceWholesaler: 650, // ₹650 INR
    quantity: 25,
    images: ['https://images.unsplash.com/photo-1609894851186-94a56e30b0d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80']
  },
  {
    name: 'Aquarium Clay Pots',
    category: 'tank-decoratives',
    accessoryType: 'pots',
    description: 'Natural clay pots that provide hiding spots for fish and help maintain water chemistry.',
    priceCustomer: 650, // ₹650 INR
    priceWholesaler: 450, // ₹450 INR
    quantity: 30,
    images: ['https://images.unsplash.com/photo-1609894851186-94a56e30b0d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80']
  },
  {
    name: 'Planting Pots with Net',
    category: 'tank-decoratives',
    accessoryType: 'pots',
    description: 'Specialized planting pots with netting to securely hold aquarium plants in place.',
    priceCustomer: 450, // ₹450 INR
    priceWholesaler: 300, // ₹300 INR
    quantity: 40,
    images: ['https://images.unsplash.com/photo-1609894851186-94a56e30b0d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80']
  },
  
  // 5. Medicines
  {
    name: 'Aquarium Water Conditioner',
    category: 'medicine',
    medicineType: 'treatment',
    description: 'Essential water conditioner that removes chlorine, chloramines, and heavy metals. Safe for fish, plants, and beneficial bacteria.',
    priceCustomer: 1450, // ₹1450 INR
    priceWholesaler: 1100, // ₹1100 INR
    quantity: 50,
    images: ['https://onyxaqua.com/wp-content/uploads/2025/09/Aqua-Cure-Yellow-Anti-Sep-50-ml-Fish-Medicine-3.jpg']
  },
  {
    name: 'Anti-Parasite Treatment',
    category: 'medicine',
    medicineType: 'treatment',
    description: 'Effective treatment for common aquarium parasites including ich, flukes, and worms. Safe for invertebrates when used as directed.',
    priceCustomer: 1850, // ₹1850 INR
    priceWholesaler: 1450, // ₹1450 INR
    quantity: 18,
    images: ['https://images.unsplash.com/photo-1595783580573-96e3cf0b4b8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80']
  },
  {
    name: 'Fish Vitamin Supplement',
    category: 'medicine',
    medicineType: 'supplement',
    description: 'Daily vitamin supplement to boost fish health, immunity, and coloration. Essential for all aquarium fish.',
    priceCustomer: 950, // ₹950 INR
    priceWholesaler: 700, // ₹700 INR
    quantity: 35,
    images: ['https://images.unsplash.com/photo-1595783580573-96e3cf0b4b8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80']
  },
  
  // 6. Foods
  {
    name: 'Premium Fish Flakes',
    category: 'food',
    description: 'High-quality fish food flakes with essential nutrients for all types of aquarium fish.',
    priceCustomer: 950, // ₹950 INR
    priceWholesaler: 700, // ₹700 INR
    quantity: 100,
    images: ['https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRzjuPoYZbYEaZ0uo7Mx2k6cYOtbwP_Ynf180muWCFqaxIvdP6H9bCpLImuuKVHKWBk7xD5UZeK2l8MpxjvddyUDDUgOiolQfhQW7OmD6tAQI2BPc2SdAU1DB5sLJGpo7WJ4yaOsg8&usqp=CAc']
  },
  {
    name: 'Frozen Bloodworms',
    category: 'food',
    description: 'High-protein frozen bloodworms that fish love. Perfect treat for carnivorous fish and to encourage breeding.',
    priceCustomer: 650, // ₹650 INR
    priceWholesaler: 490, // ₹490 INR
    quantity: 40,
    images: ['https://images.unsplash.com/photo-1595783580573-96e3cf0b4b8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80']
  },
  {
    name: 'Spirulina Algae Wafers',
    category: 'food',
    description: 'Nutritious algae wafers perfect for herbivorous fish. Sinks to the bottom for easy feeding of bottom dwellers.',
    priceCustomer: 750, // ₹750 INR
    priceWholesaler: 550, // ₹550 INR
    quantity: 30,
    images: ['https://images.unsplash.com/photo-1544787280-7a5e3b3f8a8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80']
  },
  
  // 7. Decorative Items for Fishes
  {
    name: 'Aquarium Driftwood',
    category: 'tank-decoratives',
    accessoryType: 'stones',
    description: 'Natural aquarium driftwood that provides hiding spots and enhances the natural look of your tank.',
    priceCustomer: 1500, // ₹1500 INR
    priceWholesaler: 1150, // ₹1150 INR
    quantity: 20,
    images: ['https://images-cdn.ubuy.co.in/63503b41ce31743a296b79d4-oruuum-8-pack-4-34-6-34.jpg']
  },
  {
    name: 'Artificial Coral Set',
    category: 'tank-decoratives',
    accessoryType: 'stones',
    description: 'Colorful artificial coral set that provides hiding spots without the maintenance of live corals.',
    priceCustomer: 1850, // ₹1850 INR
    priceWholesaler: 1450, // ₹1450 INR
    quantity: 15,
    images: ['https://images.unsplash.com/photo-1609894851186-94a56e30b0d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80']
  },
  {
    name: 'Decorative Castle',
    category: 'tank-decoratives',
    accessoryType: 'stones',
    description: 'Beautiful castle decoration that provides hiding spots and enhances the aesthetic appeal of your aquarium.',
    priceCustomer: 1250, // ₹1250 INR
    priceWholesaler: 950, // ₹950 INR
    quantity: 12,
    images: ['https://images.unsplash.com/photo-1609894851186-94a56e30b0d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80']
  }
];

async function reorganizeProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Find a wholesaler user to associate products with
    const wholesaler = await User.findOne({ role: 'wholesaler' });
    
    if (!wholesaler) {
      console.log('No wholesaler user found. Please create a wholesaler user first.');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`Found wholesaler: ${wholesaler.name}`);
    
    // Clear existing products to avoid duplicates
    await Product.deleteMany({});
    
    // Add seller to each product and remove subType field (it's only for our internal tracking)
    const productsWithSeller = productCategories.map(({subType, ...product}) => ({
      ...product,
      seller: wholesaler._id
    }));
    
    // Insert all products
    const insertedProducts = await Product.insertMany(productsWithSeller);
    
    console.log(`Added ${insertedProducts.length} products successfully!`);
    
    // Display organized categories
    console.log('\nProducts organized by your exact specifications:');
    
    // 1. Marine Fishes (with hard and soft sub-types)
    console.log('\n1. Marine Fishes (with hard and soft sub-types):');
    const marineFishes = productCategories.filter(p => p.category === 'fish' && p.fishType === 'marine');
    marineFishes.forEach(fish => {
      console.log(`   - ${fish.name} (${fish.subType}) - ₹${fish.priceCustomer}`);
    });
    
    // 2. Fresh Water Fishes (with hard and soft sub-types)
    console.log('\n2. Fresh Water Fishes (with hard and soft sub-types):');
    const freshwaterFishes = insertedProducts.filter(p => (p.category === 'fish' && (p.fishType === 'hard' || p.fishType === 'soft')) && p.fishType !== 'marine');
    freshwaterFishes.forEach(fish => {
      console.log(`   - ${fish.name} (${fish.fishType}) - ₹${fish.priceCustomer}`);
    });
    
    // 3. Different Types of Tanks
    console.log('\n3. Different Types of Tanks:');
    const tanks = insertedProducts.filter(p => p.category === 'tanks');
    tanks.forEach(tank => {
      console.log(`   - ${tank.name} - ₹${tank.priceCustomer}`);
    });
    
    // 4. Pots
    console.log('\n4. Pots:');
    const pots = insertedProducts.filter(p => p.category === 'tank-decoratives' && p.accessoryType === 'pots');
    pots.forEach(pot => {
      console.log(`   - ${pot.name} - ₹${pot.priceCustomer}`);
    });
    
    // 5. Medicines
    console.log('\n5. Medicines:');
    const medicines = insertedProducts.filter(p => p.category === 'medicine');
    medicines.forEach(medicine => {
      console.log(`   - ${medicine.name} - ₹${medicine.priceCustomer}`);
    });
    
    // 6. Foods
    console.log('\n6. Foods:');
    const foods = insertedProducts.filter(p => p.category === 'food');
    foods.forEach(food => {
      console.log(`   - ${food.name} - ₹${food.priceCustomer}`);
    });
    
    // 7. Decorative Items for Fishes
    console.log('\n7. Decorative Items for Fishes:');
    const decoratives = insertedProducts.filter(p => p.category === 'tank-decoratives' && p.accessoryType !== 'pots');
    decoratives.forEach(decorative => {
      console.log(`   - ${decorative.name} - ₹${decorative.priceCustomer}`);
    });
    
    // Close the connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error reorganizing products:', error);
    process.exit(1);
  }
}

// Run the script
reorganizeProducts();