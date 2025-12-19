export const getUserRole = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  return user ? user.role : null;
};

export const isCustomer = () => {
  return getUserRole() === 'customer';
};

export const isWholesaler = () => {
  return getUserRole() === 'wholesaler';
};

export const isRetailer = () => {
  return getUserRole() === 'retailer';
};

// Function to determine which price to display based on user role
export const getDisplayPrice = (product) => {
  if (isCustomer()) {
    // Customers see the retail price
    return product.retailPrice || product.suggestedRetailPrice || product.priceCustomer || product.price || 0;
  } else if (isRetailer()) {
    // Retailers see the wholesale price (buying price)
    return product.wholesalePrice || product.priceWholesaler || product.price || 0;
  } else if (isWholesaler()) {
    // Wholesalers see the wholesale price (selling price)
    return product.wholesalePrice || product.priceWholesaler || product.price || 0;
  } else {
    // Default to customer price for any other role
    return product.retailPrice || product.suggestedRetailPrice || product.priceCustomer || product.price || 0;
  }
};

// Function to get price for a specific role
export const getPriceForRole = (product, role) => {
  switch (role) {
    case 'wholesaler':
      // Price for wholesaler (Cost - not available, so usually 0 or wholesale price)
      // For margin calcs in dashboard, if we want Wholesaler Selling Price:
      return product.wholesalePrice || product.priceWholesaler || 0;
    case 'retailer':
      // Price for retailer (Buying Price = Wholesale Price)
      return product.wholesalePrice || product.priceWholesaler || 0;
    case 'customer':
      // Price for customer (Retail Price)
      return product.retailPrice || product.suggestedRetailPrice || product.priceCustomer || 0;
    default:
      return product.retailPrice || product.suggestedRetailPrice || product.priceCustomer || 0;
  }
};