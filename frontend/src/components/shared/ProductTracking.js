import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getWholesalerLocations } from '../../services/productService';

function ProductTracking() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const navigate = useNavigate();
  const { productId } = useParams();

  useEffect(() => {
    if (productId) {
      fetchLocations(productId);
    }
  }, [productId]);

  const fetchLocations = async (id) => {
    try {
      const data = await getWholesalerLocations(id);
      setLocations(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Function to simulate getting directions
  const getDirections = (location) => {
    // In a real implementation, this would integrate with a mapping service
    alert(`Directions to ${location.wholesaler.businessName || location.wholesaler.name} at ${location.address}`);
  };

  // Function to contact wholesaler
  const contactWholesaler = (location) => {
    // In a real implementation, this would open a contact form or chat
    alert(`Contacting ${location.wholesaler.businessName || location.wholesaler.name} at ${location.wholesaler.phone || 'N/A'}`);
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        background: 'linear-gradient(rgba(0, 50, 100, 0.1), rgba(0, 30, 60, 0.1))',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h2>Loading location data...</h2>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      background: 'linear-gradient(rgba(0, 50, 100, 0.1), rgba(0, 30, 60, 0.1))',
      minHeight: '100vh'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ color: '#0a4f70', margin: 0 }}>Product Tracking</h1>
        <div>
          <button 
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0a4f70',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Logout
          </button>
          <button 
            onClick={() => navigate(-1)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#00a8cc',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Back
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Map Visualization (Placeholder) */}
        <div style={{
          flex: 2,
          minWidth: '300px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ color: '#0a4f70' }}>Live Location Map</h2>
          <div style={{ 
            height: '400px', 
            backgroundColor: '#b0d4e3', 
            borderRadius: '8px', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Map placeholder with location markers */}
            <div style={{ 
              position: 'absolute', 
              width: '100%', 
              height: '100%',
              backgroundImage: 'radial-gradient(circle, #007bff 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />
            
            {locations.map((location, index) => (
              <div 
                key={location._id}
                onClick={() => setSelectedLocation(location)}
                style={{
                  position: 'absolute',
                  left: `${20 + (index * 15)}%`,
                  top: `${30 + (index * 10)}%`,
                  width: '40px',
                  height: '40px',
                  backgroundColor: selectedLocation && selectedLocation._id === location._id ? '#e74c3c' : '#00a8cc',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease',
                  transform: selectedLocation && selectedLocation._id === location._id ? 'scale(1.2)' : 'scale(1)'
                }}
              >
                {index + 1}
              </div>
            ))}
            
            <p style={{ 
              textAlign: 'center', 
              padding: '20px', 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              maxWidth: '80%'
            }}>
              Interactive Map Visualization<br />
              <small>Click on markers to view details</small>
            </p>
          </div>
        </div>

        {/* Location Details */}
        <div style={{
          flex: 1,
          minWidth: '300px'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            marginBottom: '20px'
          }}>
            <h2 style={{ color: '#0a4f70' }}>Available Locations</h2>
            {locations.length === 0 ? (
              <p>No locations available for this product.</p>
            ) : (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {locations.map((location, index) => (
                  <div 
                    key={location._id}
                    onClick={() => setSelectedLocation(location)}
                    style={{
                      padding: '15px',
                      marginBottom: '10px',
                      backgroundColor: selectedLocation && selectedLocation._id === location._id 
                        ? 'rgba(0, 168, 204, 0.2)' 
                        : 'rgba(255, 255, 255, 0.5)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: selectedLocation && selectedLocation._id === location._id 
                        ? '2px solid #00a8cc' 
                        : '1px solid #ddd',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{
                        width: '30px',
                        height: '30px',
                        backgroundColor: '#00a8cc',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        marginRight: '10px'
                      }}>
                        {index + 1}
                      </div>
                      <h3 style={{ margin: 0, color: '#0a4f70' }}>
                        {location.wholesaler.businessName || location.wholesaler.name}
                      </h3>
                    </div>
                    <p style={{ margin: '5px 0' }}><strong>Address:</strong> {location.address}</p>
                    <p style={{ margin: '5px 0' }}><strong>Last Updated:</strong> {new Date(location.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Location Details */}
          {selectedLocation && (
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{ color: '#0a4f70' }}>Location Details</h2>
              <div style={{ marginBottom: '15px' }}>
                <h3>{selectedLocation.wholesaler.businessName || selectedLocation.wholesaler.name}</h3>
                <p><strong>Address:</strong> {selectedLocation.address}</p>
                <p><strong>Coordinates:</strong> {selectedLocation.latitude}, {selectedLocation.longitude}</p>
                <p><strong>Last Updated:</strong> {new Date(selectedLocation.timestamp).toLocaleString()}</p>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => getDirections(selectedLocation)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#00a8cc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Get Directions
                </button>
                <button 
                  onClick={() => contactWholesaler(selectedLocation)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#0a4f70',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Contact
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Location History */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        marginTop: '20px'
      }}>
        <h2 style={{ color: '#0a4f70' }}>Location History</h2>
        <p>This section would show the movement history of the product with timestamps.</p>
        <div style={{ 
          height: '150px', 
          backgroundColor: '#e6f7ff', 
          borderRadius: '8px', 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <p>Timeline visualization of product movement</p>
        </div>
      </div>
    </div>
  );
}

export default ProductTracking;