import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LocationMap from '../map/LocationMap';
import { getProductById, getWholesalerLocations } from '../../services/productService';

const LocationsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchProductAndLocations();
  }, [productId]);

  const fetchProductAndLocations = async () => {
    try {
      // Fetch product details
      const productData = await getProductById(productId);
      setProduct(productData);
      
      // Fetch actual locations from backend
      const locationData = await getWholesalerLocations(productId);
      setLocations(locationData);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product and locations:', error);
      // Fallback to mock data if backend fails
      const mockLocations = generateMockLocations({ name: 'Product', category: 'default' });
      setLocations(mockLocations);
      setLoading(false);
    }
  };

  // Generate mock locations based on product (fallback if backend fails)
  const generateMockLocations = (product) => {
    // Different locations based on product category
    const locationTemplates = {
      'Decorative Items': [
        { latitude: 13.0827, longitude: 80.2707, address: "Chennai, Tamil Nadu", wholesaler: "Aquatic Decor Specialists" },
        { latitude: 12.9716, longitude: 77.5946, address: "Bangalore, Karnataka", wholesaler: "Oceanic Decorations Ltd." },
        { latitude: 17.3850, longitude: 78.4867, address: "Hyderabad, Telangana", wholesaler: "Aquarium Interior Designs" }
      ],
      'Foods': [
        { latitude: 13.0827, longitude: 80.2707, address: "Chennai, Tamil Nadu", wholesaler: "Aquatic Nutrition Center" },
        { latitude: 11.0168, longitude: 76.9558, address: "Coimbatore, Tamil Nadu", wholesaler: "Fish Food Distributors" },
        { latitude: 15.8281, longitude: 78.0373, address: "Kurnool, Andhra Pradesh", wholesaler: "Premium Fish Feed Co." }
      ],
      'Medicines': [
        { latitude: 13.0827, longitude: 80.2707, address: "Chennai, Tamil Nadu", wholesaler: "Aquatic Health Solutions" },
        { latitude: 17.3850, longitude: 78.4867, address: "Hyderabad, Telangana", wholesaler: "Aquarium Medicine Hub" },
        { latitude: 12.2958, longitude: 76.6394, address: "Mysore, Karnataka", wholesaler: "Fish Care Pharmacy" }
      ],
      'Tanks': [
        { latitude: 13.0827, longitude: 80.2707, address: "Chennai, Tamil Nadu", wholesaler: "Tank Masters" },
        { latitude: 12.9716, longitude: 77.5946, address: "Bangalore, Karnataka", wholesaler: "Aquarium Tank Specialists" },
        { latitude: 17.3850, longitude: 78.4867, address: "Hyderabad, Telangana", wholesaler: "Glass Aquarium Works" }
      ],
      'default': [
        { latitude: 13.0827, longitude: 80.2707, address: "Chennai, Tamil Nadu", wholesaler: "General Aquatic Supplier" },
        { latitude: 12.9716, longitude: 77.5946, address: "Bangalore, Karnataka", wholesaler: "Aquarium World" },
        { latitude: 17.3850, longitude: 78.4867, address: "Hyderabad, Telangana", wholesaler: "Aquatic Distributors Inc." }
      ]
    };
    
    return locationTemplates[product.category] || locationTemplates.default;
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        background: 'linear-gradient(135deg, #e0f7fa, #b2ebf2)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h2>Loading product locations...</h2>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      background: 'linear-gradient(135deg, #e0f7fa, #b2ebf2)',
      minHeight: '100vh'
    }}>
      <div style={{ 
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
      }}>
        <button 
          onClick={handleBack}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0a4f70',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ← Back
        </button>
        
        <h1 style={{ 
          color: '#0a4f70', 
          marginTop: '20px',
          fontSize: '2rem'
        }}>
          {product?.name} - Available Locations
        </h1>
        
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#333',
          marginBottom: '10px'
        }}>
          <strong>Category:</strong> {product?.category}
        </p>
        
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#333'
        }}>
          <strong>Price:</strong> ₹{product?.priceCustomer || product?.price}
        </p>
      </div>
      
      <div style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ 
          color: '#0a4f70', 
          marginBottom: '20px',
          fontSize: '1.5rem'
        }}>
          Product Locations
        </h2>
        
        <LocationMap 
          locations={locations} 
          productName={product?.name} 
        />
      </div>
      
      <div style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ 
          color: '#0a4f70', 
          marginBottom: '15px',
          fontSize: '1.5rem'
        }}>
          Location Details
        </h2>
        
        {locations.length > 0 ? (
          locations.map((location, index) => (
            <div 
              key={index}
              style={{
                padding: '15px',
                borderBottom: index < locations.length - 1 ? '1px solid #eee' : 'none',
                marginBottom: index < locations.length - 1 ? '15px' : '0'
              }}
            >
              <h3 style={{ 
                color: '#0a4f70', 
                margin: '0 0 10px 0'
              }}>
                {location.wholesaler || 'Unknown Wholesaler'}
              </h3>
              
              <p style={{ 
                margin: '5px 0',
                fontSize: '1.1rem'
              }}>
                <strong>Address:</strong> {location.address}
              </p>
              
              <p style={{ 
                margin: '5px 0',
                fontSize: '1.1rem'
              }}>
                <strong>Coordinates:</strong> {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </p>
              
              <button 
                style={{
                  marginTop: '10px',
                  padding: '8px 15px',
                  backgroundColor: '#00a8cc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Get Directions
              </button>
            </div>
          ))
        ) : (
          <p>No locations available for this product.</p>
        )}
      </div>
    </div>
  );
};

export default LocationsPage;