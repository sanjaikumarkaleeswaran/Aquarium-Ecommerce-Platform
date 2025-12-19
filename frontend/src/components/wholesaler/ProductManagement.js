import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../shared/Modal';
import { getUserProducts } from '../../services/userService';
import { addProduct, updateProduct, deleteProduct, getWholesalerLocations } from '../../services/productService';
import { convertMultipleToBase64, validateMultipleImages } from '../../services/imageService';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'fish',
    description: '',
    priceCustomer: '',
    priceWholesaler: '',
    quantity: '',
    fishType: '',
    accessoryType: '',
    medicineType: '',
    images: [] // Add images array to form data
  });
  const [imagePreviews, setImagePreviews] = useState([]); // For image previews
  const [locationData, setLocationData] = useState({
    latitude: '',
    longitude: '',
    address: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getUserProducts();
      console.log('Fetched products data:', data);

      // Handle backend response format: { count, products }
      let productList = [];
      if (data && data.products && Array.isArray(data.products)) {
        productList = data.products;
      } else if (Array.isArray(data)) {
        productList = data;
      }

      setProducts(productList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  // Handle image file selection and convert to base64
  const handleImageChange = async (e) => {
    const files = e.target.files;

    if (files.length === 0) {
      return;
    }

    // Validate images
    const validation = validateMultipleImages(files, 5, 5);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    try {
      // Convert images to base64
      const base64Images = await convertMultipleToBase64(files);

      // Create previews from original files
      const previews = Array.from(files).map(file => URL.createObjectURL(file));
      setImagePreviews(previews);

      // Update form data with base64 images
      setFormData({
        ...formData,
        images: base64Images
      });
    } catch (error) {
      console.error('Error converting images to base64:', error);
      alert('Error processing images');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocationData({
      ...locationData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Map frontend field names to backend field names
      const productData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        wholesalePrice: parseFloat(formData.priceWholesaler),  // Backend expects wholesalePrice
        suggestedRetailPrice: parseFloat(formData.priceCustomer),  // Backend expects suggestedRetailPrice
        stock: parseInt(formData.quantity),  // Backend expects stock
        images: formData.images
      };

      // Add optional fields if they exist
      if (formData.fishType) productData.fishType = formData.fishType;
      if (formData.accessoryType) productData.accessoryType = formData.accessoryType;
      if (formData.medicineType) productData.medicineType = formData.medicineType;

      // Add location data if provided
      if (locationData.latitude && locationData.longitude) {
        productData.location = {
          latitude: parseFloat(locationData.latitude),
          longitude: parseFloat(locationData.longitude),
          address: locationData.address
        };
      }

      if (editingProduct) {
        // For updates, we only send the fields that have changed
        // Remove images from update data to avoid overwriting them accidentally
        const { images, ...updateData } = productData;

        // Only include images in update if they were changed
        if (productData.images && productData.images.length > 0) {
          updateData.images = productData.images;
        }

        await updateProduct(editingProduct._id, updateData);
        setEditingProduct(null);
      } else {
        // Add new product
        await addProduct(productData);
      }

      // Reset form
      setFormData({
        name: '',
        category: 'Marine Fish',
        description: '',
        priceCustomer: '',
        priceWholesaler: '',
        quantity: '',
        fishType: '',
        accessoryType: '',
        medicineType: '',
        images: []
      });

      setImagePreviews([]);

      setLocationData({
        latitude: '',
        longitude: '',
        address: ''
      });

      setShowForm(false);
      fetchProducts();
      setSuccessMessage(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error saving product:', error);
      setSuccessMessage('Error saving product: ' + (error.response?.data?.message || error.message));
      setShowSuccessModal(true);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      // Map backend fields to frontend fields
      priceCustomer: product.suggestedRetailPrice || product.priceCustomer || '',
      priceWholesaler: product.wholesalePrice || product.priceWholesaler || '',
      quantity: product.stock || product.quantity || '',
      fishType: product.fishType || '',
      accessoryType: product.accessoryType || '',
      medicineType: product.medicineType || '',
      images: [] // Don't pre-fill images, let user upload new ones if needed
    });

    // For editing, show existing mainImage as preview if available
    if (product.mainImage) {
      setImagePreviews([product.mainImage]);
    } else if (product.images && product.images.length > 0) {
      setImagePreviews(product.images);
    } else {
      setImagePreviews([]);
    }

    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (product) => {
    console.log('Delete clicked for product:', product);
    setProductToDelete(product);
    setShowDeleteModal(true);
    console.log('Modal should open now');
  };

  const confirmDelete = async () => {
    try {
      await deleteProduct(productToDelete._id);
      setShowDeleteModal(false);
      setProductToDelete(null);
      fetchProducts();
      setSuccessMessage(`${productToDelete.name} has been deleted successfully!`);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error deleting product:', error);
      setShowDeleteModal(false);
      setSuccessMessage(`Error deleting product: ${error.response?.data?.message || error.message}`);
      setShowSuccessModal(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/');
  };

  // Function to get the main image for a product
  const getProductImage = (product) => {
    // Check mainImage first (from optimized query)
    if (product.mainImage) {
      if (product.mainImage.startsWith('data:image') || product.mainImage.startsWith('http')) {
        return product.mainImage;
      }
    }

    // Fallback to images array (for other views or legacy data)
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      // If it's a base64 image, use it directly
      if (product.images[0].startsWith('data:image')) {
        return product.images[0];
      }
      // If it's a URL, use it directly
      if (product.images[0].startsWith('http')) {
        return product.images[0];
      }
    }

    // Fallback to default image - using a direct data URL for a simple aquarium image
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiM0ZmEyY2MiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIyMCIgZmlsbD0iIzNmOGFkYSIvPjxjaXJjbGUgY3g9IjcwIiBjeT0iMzAiIHI9IjgiIGZpbGw9IiNmZmZmMDAiLz48L3N2Zz4=';
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
        <h2>Loading products...</h2>
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
        <h1 style={{ color: '#0a4f70', margin: 0 }}>Wholesaler Product Management</h1>
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
            onClick={() => navigate('/dashboard/wholesaler')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#00a8cc',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Dashboard
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              name: '',
              category: 'Marine Fish',
              description: '',
              priceCustomer: '',
              priceWholesaler: '',
              quantity: '',
              fishType: '',
              accessoryType: '',
              medicineType: '',
              images: []
            });
            setImagePreviews([]);
            setShowForm(!showForm);
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#00a8cc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          {showForm ? 'Cancel' : 'Add New Product'}
        </button>

        <button
          onClick={() => {
            setLoading(true);
            fetchProducts();
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          🔄 Refresh Stock
        </button>
      </div>

      {showForm && (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: '#0a4f70' }}>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Product Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category:</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
              >
                <option value="Marine Fish">Marine Fish</option>
                <option value="Fresh Water Fish">Fresh Water Fish</option>
                <option value="Tanks">Tanks</option>
                <option value="Pots">Pots</option>
                <option value="Medicines">Medicines</option>
                <option value="Foods">Foods</option>
                <option value="Decorative Items">Decorative Items</option>

              </select>
            </div>

            {/* Image Upload Section */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Product Images:</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
              />
              <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                You can upload up to 5 images (max 5MB each). First image will be used as the main product image.
              </p>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {imagePreviews.map((preview, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', minHeight: '80px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Customer Price (₹):</label>
                <input
                  type="number"
                  name="priceCustomer"
                  value={formData.priceCustomer}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Wholesaler Price (₹):</label>
                <input
                  type="number"
                  name="priceWholesaler"
                  value={formData.priceWholesaler}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Quantity:</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  min="0"
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                />
              </div>
            </div>

            {formData.category === 'fish' && (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Fish Type:</label>
                <select
                  name="fishType"
                  value={formData.fishType}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                >
                  <option value="">Select Fish Type</option>
                  <option value="soft">Soft</option>
                  <option value="hard">Hard</option>
                  <option value="marine">Marine</option>
                </select>
              </div>
            )}

            {formData.category === 'accessories' && (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Accessory Type:</label>
                <select
                  name="accessoryType"
                  value={formData.accessoryType}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                >
                  <option value="">Select Accessory Type</option>
                  <option value="pots">Pots</option>
                  <option value="stones">Stones</option>
                  <option value="filters">Filters</option>
                  <option value="lights">Lights</option>
                </select>
              </div>
            )}

            {formData.category === 'medicine' && (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Medicine Type:</label>
                <select
                  name="medicineType"
                  value={formData.medicineType}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                >
                  <option value="">Select Medicine Type</option>
                  <option value="treatment">Treatment</option>
                  <option value="prevention">Prevention</option>
                  <option value="supplement">Supplement</option>
                </select>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <h3>Location Information (Optional)</h3>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Latitude:</label>
                  <input
                    type="number"
                    name="latitude"
                    value={locationData.latitude}
                    onChange={handleLocationChange}
                    step="0.000001"
                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Longitude:</label>
                  <input
                    type="number"
                    name="longitude"
                    value={locationData.longitude}
                    onChange={handleLocationChange}
                    step="0.000001"
                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Address:</label>
                <input
                  type="text"
                  name="address"
                  value={locationData.address}
                  onChange={handleLocationChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                padding: '12px 25px',
                backgroundColor: '#0a4f70',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
          </form>
        </div>
      )}

      <div>
        <h2 style={{ color: '#0a4f70' }}>Your Products</h2>
        {products.length === 0 ? (
          <p style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '10px'
          }}>
            No products found. Add your first product using the button above.
          </p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {products.map(product => (
              <div
                key={product._id}
                style={{
                  width: '300px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                }}
              >
                {/* Product Image Preview */}
                <div style={{
                  width: '100%',
                  height: '150px',
                  backgroundImage: `url(${getProductImage(product)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '5px',
                  marginBottom: '15px'
                }} />

                <h3 style={{ margin: '0 0 10px 0', color: '#0a4f70' }}>{product.name}</h3>
                <p style={{ margin: '5px 0' }}><strong>Category:</strong> {product.category}</p>
                <p style={{ margin: '5px 0' }}><strong>Description:</strong> {product.description}</p>
                <p style={{ margin: '5px 0' }}><strong>Customer Price:</strong> ₹{product.suggestedRetailPrice || product.priceCustomer || 0}</p>
                <p style={{ margin: '5px 0' }}><strong>Wholesaler Price:</strong> ₹{product.wholesalePrice || product.priceWholesaler || 0}</p>
                <p style={{ margin: '5px 0' }}><strong>Stock:</strong> {product.stock || product.quantity || 0}</p>

                {product.fishType && (
                  <p style={{ margin: '5px 0' }}><strong>Fish Type:</strong> {product.fishType}</p>
                )}

                {product.accessoryType && (
                  <p style={{ margin: '5px 0' }}><strong>Accessory Type:</strong> {product.accessoryType}</p>
                )}

                {product.medicineType && (
                  <p style={{ margin: '5px 0' }}><strong>Medicine Type:</strong> {product.medicineType}</p>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button
                    onClick={() => handleEdit(product)}
                    style={{
                      padding: '8px 15px',
                      backgroundColor: '#0a4f70',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    style={{
                      padding: '8px 15px',
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setProductToDelete(null);
        }}
        title="🗑️ Delete Product"
        showCancel={true}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
      >
        <div>
          <p style={{
            color: '#d32f2f',
            fontWeight: 'bold',
            marginBottom: '15px',
            fontSize: '1.1rem'
          }}>
            Are you sure you want to delete this product?
          </p>

          {productToDelete && (
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '15px'
            }}>
              <p style={{ margin: '5px 0', color: '#333' }}>
                <strong>Product:</strong> {productToDelete.name}
              </p>
              <p style={{ margin: '5px 0', color: '#666' }}>
                <strong>Category:</strong> {productToDelete.category}
              </p>
              <p style={{ margin: '5px 0', color: '#666' }}>
                <strong>Stock:</strong> {productToDelete.quantity} units
              </p>
            </div>
          )}

          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            This action cannot be undone. The product will be permanently removed from your inventory.
          </p>
        </div>
      </Modal>

      {/* Success/Error Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={successMessage.includes('Error') ? '❌ Error' : '✅ Success'}
        showCancel={false}
        confirmText="OK"
      >
        <p style={{ color: '#666', fontSize: '1rem' }}>
          {successMessage}
        </p>
      </Modal>
    </div>
  );
}

export default ProductManagement;