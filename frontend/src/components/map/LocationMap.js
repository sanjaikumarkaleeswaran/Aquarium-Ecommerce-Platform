import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMap = ({ locations, productName }) => {
  const [mapCenter, setMapCenter] = useState([11.1271, 78.6569]); // Default to India center
  const [zoomLevel, setZoomLevel] = useState(5);

  useEffect(() => {
    // If we have locations, center the map on the average position
    if (locations && locations.length > 0) {
      // Calculate center point from all locations
      const avgLat = locations.reduce((sum, loc) => sum + loc.latitude, 0) / locations.length;
      const avgLng = locations.reduce((sum, loc) => sum + loc.longitude, 0) / locations.length;
      
      setMapCenter([avgLat, avgLng]);
      
      // Adjust zoom based on spread of locations
      if (locations.length === 1) {
        setZoomLevel(13);
      } else {
        setZoomLevel(8);
      }
    }
  }, [locations]);

  // Mock locations data if none provided (for demonstration)
  const mockLocations = [
    { latitude: 13.0827, longitude: 80.2707, address: "Chennai, Tamil Nadu", wholesaler: "Aquatic Supplies Co." },
    { latitude: 12.9716, longitude: 77.5946, address: "Bangalore, Karnataka", wholesaler: "Oceanic Aquariums Ltd." },
    { latitude: 17.3850, longitude: 78.4867, address: "Hyderabad, Telangana", wholesaler: "Marine Life Distributors" }
  ];

  const locationsToDisplay = locations && locations.length > 0 ? locations : mockLocations;

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)' }}>
      <MapContainer 
        center={mapCenter} 
        zoom={zoomLevel} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {locationsToDisplay.map((location, index) => (
          <Marker 
            key={index} 
            position={[location.latitude, location.longitude]}
          >
            <Popup>
              <div>
                <h3 style={{ margin: '0 0 10px 0', color: '#0a4f70' }}>{productName || 'Product'}</h3>
                <p style={{ margin: '5px 0' }}><strong>Address:</strong> {location.address}</p>
                <p style={{ margin: '5px 0' }}><strong>Wholesaler:</strong> {location.wholesaler || 'Unknown'}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LocationMap;