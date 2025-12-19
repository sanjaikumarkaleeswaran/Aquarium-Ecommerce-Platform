// Real API call to fetch products for recommendations
import { getAllRetailerProducts } from './retailerService';

// Fallback to empty array if API fails, but we try to fetch real data
let cachedProducts = [];

// Helper to ensure we have products
const ensureProducts = async () => {
  if (cachedProducts.length > 0) return cachedProducts;
  try {
    const response = await getAllRetailerProducts();
    // Handle different response structures
    if (response.products && Array.isArray(response.products)) {
      cachedProducts = response.products;
    } else if (Array.isArray(response)) {
      cachedProducts = response;
    }
    return cachedProducts;
  } catch (error) {
    console.warn("Failed to fetch products for recommendations, using empty list", error);
    return [];
  }
};

// Load interactions from localStorage to persist recommendations
let userInteractions = JSON.parse(localStorage.getItem('ai_user_interactions')) || [];

// Function to record user interactions (simulating data collection for AI)
export const recordUserInteraction = (userId, productId, action) => {
  const products = cachedProducts;

  // Create interaction record
  const interaction = {
    userId,
    productId,
    action, // 'view', 'purchase', 'search', 'cart'
    timestamp: new Date().toISOString()
  };

  // Add to in-memory array
  userInteractions.push(interaction);

  // Keep only the last 100 interactions
  if (userInteractions.length > 100) {
    userInteractions = userInteractions.slice(-100);
  }

  // Persist to storage
  localStorage.setItem('ai_user_interactions', JSON.stringify(userInteractions));
};

// Function to get personalized recommendations based on user interactions
export const getPersonalizedRecommendations = async (userId, limit = 5) => {
  // Ensure we have products to recommend from
  const products = await ensureProducts();

  // Get user's interaction history
  const userHistory = userInteractions.filter(interaction => interaction.userId === userId);

  // If no history, return popular products (or random ones for variety)
  if (userHistory.length === 0) {
    // If we have products, return randomized subset as "Discovery"
    if (products.length > 0) {
      return products.sort(() => 0.5 - Math.random()).slice(0, limit);
    }
    return [];
  }

  // Count category preferences based on interactions
  const categoryCount = {};
  const tagCount = {};



  userHistory.forEach(interaction => {
    const product = products.find(p => p.id === interaction.productId || p._id === interaction.productId);
    if (product) {
      // Weight interactions by action type
      let weight = 1;
      if (interaction.action === 'purchase') weight = 3;
      else if (interaction.action === 'cart') weight = 2;

      // Count categories
      categoryCount[product.category] = (categoryCount[product.category] || 0) + weight;

      // Count tags
      product.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + weight;
      });
    }
  });

  // Sort categories and tags by preference
  const preferredCategories = Object.keys(categoryCount)
    .sort((a, b) => categoryCount[b] - categoryCount[a]);

  const preferredTags = Object.keys(tagCount)
    .sort((a, b) => tagCount[b] - tagCount[a]);

  // Score products based on user preferences
  const scoredProducts = products.map(product => {
    let score = 0;

    // Add score for category match
    const categoryIndex = preferredCategories.indexOf(product.category);
    if (categoryIndex !== -1) {
      score += (preferredCategories.length - categoryIndex) * 10;
    }

    // Add score for tag matches
    if (product.tags && Array.isArray(product.tags)) {
      product.tags.forEach(tag => {
        const tagIndex = preferredTags.indexOf(tag);
        if (tagIndex !== -1) {
          score += (preferredTags.length - tagIndex) * 5;
        }
      });
    }

    // Slight preference for products not yet interacted with
    const hasInteracted = userHistory.some(interaction => interaction.productId === product.id || interaction.productId === product._id);
    if (!hasInteracted) {
      score += 2;
    }

    return { product, score };
  });

  // Sort by score and return top recommendations
  return scoredProducts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.product);
};

// Function to get products by category
export const getRelatedProducts = async (productId, limit = 5) => {
  const products = await ensureProducts();
  const product = products.find(p => p.id === productId || p._id === productId);
  if (!product) return products.slice(0, limit);

  // Score products based on category and tag similarity
  const scoredProducts = products
    .filter(p => p.id !== productId && p._id !== productId) // Exclude the product itself
    .map(otherProduct => {
      let score = 0;

      // Add score for category match
      if (otherProduct.category === product.category) {
        score += 20;
      }

      // Add score for tag matches
      if (product.tags && Array.isArray(product.tags) && otherProduct.tags && Array.isArray(otherProduct.tags)) {
        product.tags.forEach(tag => {
          if (otherProduct.tags.includes(tag)) {
            score += 10;
          }
        });
      }

      return { product: otherProduct, score };
    });

  // Sort by score and return top recommendations
  return scoredProducts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.product);
};

// Function to get trending products (based on recent interactions)
export const getTrendingProducts = async (limit = 5) => {
  const products = await ensureProducts();
  // Get interactions from the last 7 days
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const recentInteractions = userInteractions.filter(
    interaction => new Date(interaction.timestamp) > oneWeekAgo
  );

  // Count product interactions
  const productCount = {};
  recentInteractions.forEach(interaction => {
    productCount[interaction.productId] = (productCount[interaction.productId] || 0) + 1;
  });

  // Sort products by interaction count
  const trendingProductIds = Object.keys(productCount)
    .sort((a, b) => productCount[b] - productCount[a])
    .map(id => parseInt(id));

  // Return trending products
  return products
    .filter(product => trendingProductIds.includes(product.id) || trendingProductIds.includes(product._id))
    .slice(0, limit);
};

// Function to get products by category
export const getProductsByCategory = async (category) => {
  const products = await ensureProducts();
  return products.filter(product => product.category === category);
};

export default {
  recordUserInteraction,
  getPersonalizedRecommendations,
  getRelatedProducts,
  getTrendingProducts,
  getProductsByCategory
};