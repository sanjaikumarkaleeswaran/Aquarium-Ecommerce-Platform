import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Sample products data with images
const sampleProducts = [
  // Fish products
  {
    name: 'Blue Tang Fish',
    category: 'fish',
    description: 'Vibrant blue tang fish with striking yellow tail, perfect for saltwater aquariums. Requires a minimum 30-gallon tank.',
    priceCustomer: 1950,
    priceWholesaler: 1550,
    quantity: 15,
    fishType: 'marine',
    images: ['https://images.unsplash.com/photo-1544783745-9b0c9c0d4e3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80']
  },
  {
    name: 'Clown Fish',
    category: 'fish',
    description: 'Bright orange clown fish with white stripes, pairs well with anemones. Perfect for beginner saltwater aquariums.',
    priceCustomer: 1450,
    priceWholesaler: 1150,
    quantity: 20,
    fishType: 'marine',
    images: ['https://images.unsplash.com/photo-1532027352178-19b1b3a6d9c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80']
  },
  {
    name: 'Goldfish',
    category: 'fish',
    description: 'Classic golden fish, perfect for beginners and small freshwater aquariums. Can grow up to 12 inches.',
    priceCustomer: 450,
    priceWholesaler: 300,
    quantity: 30,
    fishType: 'hard',
    images: ['https://images.unsplash.com/photo-1544787280-7a5e3b3f8a8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80']
  },
  {
    name: 'Neon Tetra',
    category: 'fish',
    description: 'Small, vibrant blue and red schooling fish. Best kept in groups of 6 or more in planted tanks.',
    priceCustomer: 300,
    priceWholesaler: 190,
    quantity: 50,
    fishType: 'soft',
    images: ['https://images.unsplash.com/photo-1598270370202-44952b400d8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80']
  },
  {
    name: 'Oscar Fish',
    category: 'hard-fish',
    description: 'Large, intelligent cichlid with distinctive markings. Requires a 55+ gallon tank and experienced care.',
    priceCustomer: 1450,
    priceWholesaler: 1100,
    quantity: 12,
    fishType: 'hard',
    images: ['https://images.unsplash.com/photo-1532027352178-19b1b3a6d9c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80']
  },
  {
    name: 'Discus Fish',
    category: 'soft-fish',
    description: 'Beautiful disc-shaped fish with vibrant colors. Requires pristine water conditions and soft water.',
    priceCustomer: 2750,
    priceWholesaler: 2200,
    quantity: 8,
    fishType: 'soft',
    images: ['https://images.unsplash.com/photo-1598270370202-44952b400d8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80']
  },
  
  // Corals
  {
    name: 'Brain Coral Set',
    category: 'corals',
    description: 'Beautiful brain coral with vibrant colors, perfect for reef aquariums. Requires moderate care and feeding.',
    priceCustomer: 2650,
    priceWholesaler: 2150,
    quantity: 12,
    images: ['https://images.unsplash.com/photo-1609894851186-94a56e30b0d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80']
  },
  
  // Starfish
  {
    name: 'Red Starfish',
    category: 'starfish',
    description: 'Beautiful red starfish that adds movement and color to your aquarium. Requires sandy substrate.',
    priceCustomer: 1200,
    priceWholesaler: 950,
    quantity: 10,
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTnHMI3dm-2nifSJ-DsioxVBtewzca0M0LkSq2veUclQvWYAL3-c5A4Z8LVbnpHZe63vk&usqp=CAU',
      'https://images.unsplash.com/photo-1544787280-7a5e3b3f8a8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
    ]
  },
  
  // Tanks
  {
    name: 'Aquarium Tank 20gal',
    category: 'tanks',
    description: 'Clear glass aquarium tank with 20-gallon capacity, includes filtration system and LED lighting.',
    priceCustomer: 6750,
    priceWholesaler: 5700,
    quantity: 8,
    images: ['https://images.unsplash.com/photo-1595783580573-96e3cf0b4b8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80']
  },
  
  // Tank Decoratives
  {
    name: 'Aquarium Driftwood',
    category: 'tank-decoratives',
    description: 'Natural aquarium driftwood that provides hiding spots and enhances the natural look of your tank.',
    priceCustomer: 1500,
    priceWholesaler: 1150,
    quantity: 20,
    images: ['https://images.unsplash.com/photo-1609894851186-94a56e30b0d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80']
  },
  
  // Accessories
  {
    name: 'Fish Food Flakes',
    category: 'food',
    description: 'High-quality fish food flakes with essential nutrients for all types of aquarium fish.',
    priceCustomer: 650,
    priceWholesaler: 490,
    quantity: 100,
    images: ['https://images.unsplash.com/photo-1544787280-7a5e3b3f8a8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80']
  },
  
  // Medicine
  {
    name: 'Water Treatment Solution',
    category: 'medicine',
    description: 'Complete water treatment solution to maintain healthy aquarium conditions and prevent fish diseases.',
    priceCustomer: 950,
    priceWholesaler: 700,
    quantity: 50,
    medicineType: 'treatment',
    images: ['https://images.unsplash.com/photo-1544787280-7a5e3b3f8a8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80']
  }
];

async function addSampleProducts() {
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
    
    // Add seller to each product
    const productsWithSeller = sampleProducts.map(product => ({
      ...product,
      seller: wholesaler._id
    }));
    
    // Insert all products
    const insertedProducts = await Product.insertMany(productsWithSeller);
    
    console.log(`Added ${insertedProducts.length} sample products successfully!`);
    
    // Close the connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error adding sample products:', error);
    process.exit(1);
  }
}

// Run the script
addSampleProducts();