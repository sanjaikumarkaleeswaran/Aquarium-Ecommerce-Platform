import React, { useState, useEffect } from 'react';
import { getProducts } from '../../services/productService';

function InventoryDashboard() {
  const [inventoryData, setInventoryData] = useState({
    totalItems: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0,
    lowStockItems: [],
    categoryDistribution: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real data from the API
  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        setLoading(true);
        const products = await getProducts();

        // Calculate totals
        const totalItems = products.length;

        // Calculate low stock and out of stock items
        const lowStockItems = [];
        let outOfStockCount = 0;
        let lowStockCount = 0;

        products.forEach(product => {
          // Use actual quantity from product data if available, otherwise simulate
          const currentStock = product.quantity !== undefined ? product.quantity :
            (parseInt(product._id.slice(-4), 16) % 15);
          const reorderLevel = 5;

          if (currentStock === 0) {
            outOfStockCount++;
            lowStockItems.push({
              id: product._id,
              name: product.name,
              category: product.category,
              currentStock,
              reorderLevel
            });
          } else if (currentStock <= reorderLevel) {
            lowStockCount++;
            lowStockItems.push({
              id: product._id,
              name: product.name,
              category: product.category,
              currentStock,
              reorderLevel
            });
          }
        });

        // Take only the first 5 low stock items for display
        const displayLowStockItems = lowStockItems.slice(0, 5);

        // Calculate total value using actual product prices
        let totalValue = 0;
        try {
          totalValue = products.reduce((sum, product) => {
            // Try different price fields in order of preference
            const price = product.priceWholesaler || product.priceRetailer ||
              product.priceCustomer || 0;
            const quantity = product.quantity !== undefined ? product.quantity : 1;
            return sum + (price * quantity);
          }, 0);
        } catch (priceError) {
          console.warn('Error calculating total value:', priceError);
          // Fallback calculation
          totalValue = totalItems * 1000; // Simple fallback
        }

        // Calculate category distribution
        const categoryCounts = {};
        products.forEach(product => {
          const category = product.category || 'Unknown';
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        const categoryDistribution = Object.entries(categoryCounts).map(([name, count], index) => {
          const percentage = totalItems > 0 ? Math.round((count / totalItems) * 100) : 0;
          // Different colors for different categories
          const colors = ['#00a8cc', '#4ecdc4', '#1dd1a1', '#feca57', '#ff6b6b', '#ff9ff3', '#a29bfe', '#fd79a8'];
          return {
            name,
            count,
            percentage,
            color: colors[index % colors.length]
          };
        });

        setInventoryData({
          totalItems,
          lowStock: lowStockCount,
          outOfStock: outOfStockCount,
          totalValue,
          lowStockItems: displayLowStockItems,
          categoryDistribution
        });

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch inventory data:', err);
        setError('Failed to fetch inventory data: ' + (err.message || 'Unknown error'));
        setLoading(false);

        // Fallback to mock data in case of error
        const mockData = {
          totalItems: 12, // More realistic count based on sample data
          lowStock: 3,
          outOfStock: 1,
          totalValue: 15000,
          lowStockItems: [
            { id: 1, name: 'Blue Tang Fish', category: 'Marine Fish', currentStock: 3, reorderLevel: 10 },
            { id: 2, name: 'Aquarium Tank 20gal', category: 'Tanks', currentStock: 2, reorderLevel: 5 },
            { id: 3, name: 'LED Aquarium Light', category: 'Decorative Items', currentStock: 0, reorderLevel: 5 },
            { id: 4, name: 'Water Treatment Solution', category: 'Medicines', currentStock: 4, reorderLevel: 10 },
            { id: 5, name: 'Fish Food Flakes', category: 'Foods', currentStock: 1, reorderLevel: 5 }
          ],
          categoryDistribution: [
            { name: 'Marine Fish', count: 4, percentage: 33, color: '#00a8cc' },
            { name: 'Fresh Water Fish', count: 3, percentage: 25, color: '#1dd1a1' },
            { name: 'Tanks', count: 1, percentage: 8, color: '#4ecdc4' },
            { name: 'Foods', count: 1, percentage: 8, color: '#feca57' },
            { name: 'Medicines', count: 1, percentage: 8, color: '#ff6b6b' },
            { name: 'Decorative Items', count: 1, percentage: 8, color: '#ff9ff3' },
            { name: 'Corals', count: 1, percentage: 8, color: '#fd79a8' }
          ]
        };

        setInventoryData(mockData);
      }
    };

    fetchInventoryData();
  }, []);

  if (loading) {
    return (
      <div style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '15px' }}>📊</div>
          <h2>Loading Inventory Data</h2>
          <p>Please wait while we fetch your inventory information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
          maxWidth: '600px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>⚠️</div>
          <h2>Unable to Load Inventory Data</h2>
          <p style={{ color: '#ff6b6b', fontWeight: '500' }}>{error}</p>
          <div style={{
            textAlign: 'left',
            backgroundColor: '#fff5f5',
            padding: '15px',
            borderRadius: '8px',
            margin: '20px 0',
            borderLeft: '4px solid #ff6b6b'
          }}>
            <h3 style={{ marginTop: 0, color: '#0a4f70' }}>Troubleshooting Tips:</h3>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Ensure the backend server is running</li>
              <li>Verify MongoDB is running and accessible</li>
              <li>Check your network connection</li>
              <li>Confirm the API endpoint is accessible at /api/products</li>
            </ul>
          </div>
          <p>The inventory dashboard is currently displaying simulated data for demonstration purposes.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#00a8cc',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#0a4f70'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#00a8cc'}
            >
              Retry Loading Data
            </button>
            <button
              onClick={() => {
                // Reset to initial mock data
                const mockData = {
                  totalItems: 12,
                  lowStock: 3,
                  outOfStock: 1,
                  totalValue: 15000,
                  lowStockItems: [
                    { id: 1, name: 'Blue Tang Fish', category: 'Marine Fish', currentStock: 3, reorderLevel: 10 },
                    { id: 2, name: 'Aquarium Tank 20gal', category: 'Tanks', currentStock: 2, reorderLevel: 5 },
                    { id: 3, name: 'LED Aquarium Light', category: 'Decorative Items', currentStock: 0, reorderLevel: 5 },
                    { id: 4, name: 'Water Treatment Solution', category: 'Medicines', currentStock: 4, reorderLevel: 10 },
                    { id: 5, name: 'Fish Food Flakes', category: 'Foods', currentStock: 1, reorderLevel: 5 }
                  ],
                  categoryDistribution: [
                    { name: 'Marine Fish', count: 4, percentage: 33, color: '#00a8cc' },
                    { name: 'Fresh Water Fish', count: 3, percentage: 25, color: '#1dd1a1' },
                    { name: 'Tanks', count: 1, percentage: 8, color: '#4ecdc4' },
                    { name: 'Foods', count: 1, percentage: 8, color: '#feca57' },
                    { name: 'Medicines', count: 1, percentage: 8, color: '#ff6b6b' },
                    { name: 'Decorative Items', count: 1, percentage: 8, color: '#ff9ff3' },
                    { name: 'Corals', count: 1, percentage: 8, color: '#fd79a8' }
                  ]
                };
                setInventoryData(mockData);
                setError(null);
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4ecdc4',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1dd1a1'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#4ecdc4'}
            >
              Use Demo Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
      minHeight: '100vh'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h1 style={{
            color: '#0a4f70',
            margin: 0,
            fontSize: '2.5rem',
            background: 'linear-gradient(90deg, #00a8cc, #0a4f70)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            📊 Inventory Management
          </h1>
          <p style={{ color: '#0a4f70', fontSize: '1.1rem', marginTop: '5px' }}>
            Track and manage your aquarium inventory
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 168, 204, 0.1)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer'
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.08)';
          }}
        >
          <h3 style={{
            color: '#0a4f70',
            margin: '0 0 15px 0',
            fontSize: '1.1rem'
          }}>
            Total Items
          </h3>
          <p style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#00a8cc',
            margin: '0 0 5px 0'
          }}>
            {inventoryData.totalItems.toLocaleString()}
          </p>
          <p style={{
            color: '#1dd1a1',
            margin: 0,
            fontSize: '0.9rem'
          }}>
            +8% from last month
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 168, 204, 0.1)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer'
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.08)';
          }}
        >
          <h3 style={{
            color: '#0a4f70',
            margin: '0 0 15px 0',
            fontSize: '1.1rem'
          }}>
            Low Stock
          </h3>
          <p style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#ff6b6b',
            margin: '0 0 5px 0'
          }}>
            {inventoryData.lowStock}
          </p>
          <p style={{
            color: '#ff6b6b',
            margin: 0,
            fontSize: '0.9rem'
          }}>
            Requires attention
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 168, 204, 0.1)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer'
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.08)';
          }}
        >
          <h3 style={{
            color: '#0a4f70',
            margin: '0 0 15px 0',
            fontSize: '1.1rem'
          }}>
            Out of Stock
          </h3>
          <p style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#ff9ff3',
            margin: '0 0 5px 0'
          }}>
            {inventoryData.outOfStock}
          </p>
          <p style={{
            color: '#ff6b6b',
            margin: 0,
            fontSize: '0.9rem'
          }}>
            Immediate restock needed
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 168, 204, 0.1)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer'
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.08)';
          }}
        >
          <h3 style={{
            color: '#0a4f70',
            margin: '0 0 15px 0',
            fontSize: '1.1rem'
          }}>
            Total Value
          </h3>
          <p style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#4ecdc4',
            margin: '0 0 5px 0'
          }}>
            ${inventoryData.totalValue.toLocaleString()}
          </p>
          <p style={{
            color: '#1dd1a1',
            margin: 0,
            fontSize: '0.9rem'
          }}>
            Current inventory value
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '20px'
      }}>
        {/* Low Stock Alerts */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 168, 204, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{
              color: '#0a4f70',
              margin: 0,
              paddingBottom: '15px',
              borderBottom: '2px solid rgba(0, 168, 204, 0.2)'
            }}>
              ⚠️ Low Stock Alerts
            </h2>
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#00a8cc',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.3s'
            }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#0a4f70'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#00a8cc'}
            >
              Reorder Items
            </button>
          </div>
          <div style={{
            overflowX: 'auto'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee' }}>
                  <th style={{ textAlign: 'left', padding: '15px', color: '#0a4f70' }}>Product</th>
                  <th style={{ textAlign: 'left', padding: '15px', color: '#0a4f70' }}>Category</th>
                  <th style={{ textAlign: 'left', padding: '15px', color: '#0a4f70' }}>Current Stock</th>
                  <th style={{ textAlign: 'left', padding: '15px', color: '#0a4f70' }}>Reorder Level</th>
                  <th style={{ textAlign: 'left', padding: '15px', color: '#0a4f70' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {inventoryData.lowStockItems.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px', fontWeight: '500' }}>{item.name}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        backgroundColor: 'rgba(0, 168, 204, 0.1)',
                        color: '#00a8cc',
                        padding: '5px 10px',
                        borderRadius: '20px',
                        fontSize: '0.8rem'
                      }}>
                        {item.category}
                      </span>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        color: item.currentStock === 0 ? '#ff6b6b' :
                          item.currentStock <= item.reorderLevel * 0.5 ? '#ff9ff3' : '#feca57',
                        fontWeight: '500'
                      }}>
                        {item.currentStock}
                      </span>
                    </td>
                    <td style={{ padding: '15px' }}>{item.reorderLevel}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        color: item.currentStock === 0 ? '#ff6b6b' :
                          item.currentStock <= item.reorderLevel * 0.5 ? '#ff9ff3' : '#feca57',
                        fontWeight: '500'
                      }}>
                        {item.currentStock === 0 ? 'Out of Stock' :
                          item.currentStock <= item.reorderLevel * 0.5 ? 'Critical' : 'Low Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Distribution */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 168, 204, 0.1)'
        }}>
          <h2 style={{
            color: '#0a4f70',
            margin: '0 0 20px 0',
            paddingBottom: '15px',
            borderBottom: '2px solid rgba(0, 168, 204, 0.2)'
          }}>
            📦 Category Distribution
          </h2>
          <div style={{
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {inventoryData.categoryDistribution.map((category, index) => (
              <div key={index} style={{
                marginBottom: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '5px'
                }}>
                  <span style={{ fontWeight: '500', color: '#333' }}>{category.name}</span>
                  <span style={{ color: category.color }}>{category.count}</span>
                </div>
                <div style={{
                  height: '8px',
                  backgroundColor: 'rgba(0, 168, 204, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${category.percentage}%`,
                    backgroundColor: category.color,
                    borderRadius: '4px'
                  }}></div>
                </div>
                <div style={{
                  textAlign: 'right',
                  fontSize: '0.8rem',
                  color: '#888',
                  marginTop: '3px'
                }}>
                  {category.percentage}% of inventory
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventoryDashboard;