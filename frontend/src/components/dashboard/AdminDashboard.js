import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../shared/Header';
import Modal from '../shared/Modal';
import { getPendingApprovals, approveUser, rejectUser, getAllUsers, deactivateUser, activateUser, deleteUser } from '../../services/adminService';
import { getProducts } from '../../services/productService';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch pending approvals
      const approvalsRes = await getPendingApprovals();
      setPendingApprovals(approvalsRes.users || []);

      // Fetch all users
      const usersRes = await getAllUsers();
      setUsers(usersRes.users || []);

      // Fetch products
      const productsRes = await getProducts();
      setProducts(productsRes.products || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to approve ${userName}?`)) {
      return;
    }

    try {
      await approveUser(userId, 'Approved by admin');
      alert(`${userName} has been approved!`);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Failed to approve user. Please try again.');
    }
  };

  const handleReject = async (userId, userName) => {
    const reason = prompt(`Please provide a reason for rejecting ${userName}:`);

    if (!reason || reason.trim().length < 10) {
      alert('Rejection reason must be at least 10 characters.');
      return;
    }

    try {
      await rejectUser(userId, reason);
      alert(`${userName} has been rejected.`);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error rejecting user:', error);
      const errorMsg = error.response?.data?.message || 'Failed to reject user. Please try again.';
      alert(errorMsg);
    }
  };

  const handleDeactivate = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to deactivate ${userName}? They will not be able to login.`)) {
      return;
    }

    try {
      await deactivateUser(userId);
      alert(`${userName} has been deactivated.`);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error deactivating user:', error);
      alert('Failed to deactivate user. Please try again.');
    }
  };

  const handleActivate = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to activate ${userName}?`)) {
      return;
    }

    try {
      await activateUser(userId);
      alert(`${userName} has been activated.`);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error activating user:', error);
      alert('Failed to activate user. Please try again.');
    }
  };

  const handleDeleteUser = (userId, userName) => {
    setUserToDelete({ id: userId, name: userName });
    setDeleteConfirmation('');
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteConfirmation !== 'DELETE') {
      alert('Please type "DELETE" to confirm.');
      return;
    }

    try {
      await deleteUser(userToDelete.id);
      alert(`${userToDelete.name} has been permanently deleted.`);
      setShowDeleteModal(false);
      setDeleteConfirmation('');
      setUserToDelete(null);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error deleting user:', error);
      const errorMsg = error.response?.data?.message || 'Failed to delete user. Please try again.';
      alert(errorMsg);
    }
  };

  // Helper function to render user cards with actions
  const renderUserCard = (user) => {
    const isActive = user.isActive !== false; // Default to true if not specified

    return (
      <div
        key={user._id || user.id}
        style={{
          padding: '15px',
          borderRadius: '8px',
          backgroundColor: isActive ? 'rgba(176, 212, 227, 0.2)' : 'rgba(255, 0, 0, 0.1)',
          border: `1px solid ${isActive ? '#b0d4e3' : '#ffcdd2'}`,
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <p style={{
                margin: 0,
                fontWeight: 'bold',
                color: 'var(--ocean-blue)'
              }}>
                {user.name}
                {!isActive && (
                  <span style={{
                    marginLeft: '10px',
                    padding: '2px 8px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    fontSize: '0.75rem',
                    borderRadius: '10px'
                  }}>
                    INACTIVE
                  </span>
                )}
              </p>
              <p style={{
                margin: '5px 0 0 0',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem'
              }}>
                {user.email}
              </p>
              {user.approvalStatus && (
                <p style={{
                  margin: '5px 0 0 0',
                  fontSize: '0.85rem',
                  color: user.approvalStatus === 'approved' ? '#4caf50' : '#ff9800'
                }}>
                  Status: {user.approvalStatus}
                </p>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {isActive ? (
            <button
              onClick={() => handleDeactivate(user._id || user.id, user.name)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f57c00'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ff9800'}
            >
              🚫 Deactivate
            </button>
          ) : (
            <button
              onClick={() => handleActivate(user._id || user.id, user.name)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#4caf50'}
            >
              ✓ Activate
            </button>
          )}

          <button
            onClick={() => handleDeleteUser(user._id || user.id, user.name)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '0.85rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#da190b'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f44336'}
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--background-gradient)',
        color: 'var(--text-main)'
      }}>
        <h2 style={{ color: 'var(--ocean-blue)' }}>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      background: 'var(--background-gradient)',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      overflowY: 'auto'
    }}>
      <Header
        title="Admin Dashboard"
        subtitle="Manage users and products across the platform"
      />

      {/* Pending Approvals Section */}
      {pendingApprovals.length > 0 && (
        <div style={{
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '25px',
          border: '2px solid #ffc107',
          boxShadow: '0 4px 15px rgba(255, 193, 7, 0.2)'
        }}>
          <h2 style={{
            color: '#f57c00',
            fontSize: '1.8rem',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            ⚠️ Pending Approvals ({pendingApprovals.length})
          </h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            The following users are waiting for your approval to access the platform.
          </p>

          <div style={{ display: 'grid', gap: '15px' }}>
            {pendingApprovals.map(user => (
              <div
                key={user._id}
                style={{
                  padding: '20px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid #ffc107',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{ marginBottom: '15px' }}>
                  <h3 style={{ margin: '0 0 5px 0', color: 'var(--ocean-blue)' }}>
                    {user.name}
                  </h3>
                  <p style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)' }}>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)' }}>
                    <strong>Role:</strong> <span style={{
                      textTransform: 'capitalize',
                      backgroundColor: user.role === 'retailer' ? '#e3f2fd' : '#fff3e0',
                      padding: '3px 10px',
                      borderRadius: '5px',
                      fontWeight: 'bold',
                      color: 'black'
                    }}>
                      {user.role}
                    </span>
                  </p>
                  {user.businessName && (
                    <p style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)' }}>
                      <strong>Business:</strong> {user.businessName}
                    </p>
                  )}
                  {user.storeName && (
                    <p style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)' }}>
                      <strong>Store:</strong> {user.storeName}
                    </p>
                  )}
                  <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Registered: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleApprove(user._id, user.name)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#4caf50'}
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleReject(user._id, user.name)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#da190b'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#f44336'}
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap' }}>
        {/* User Management Section */}
        <div style={{
          flex: 1,
          minWidth: '300px',
          backgroundColor: 'var(--card-bg)',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 168, 204, 0.1)',
          transition: 'all 0.3s ease'
        }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.08)';
          }}
        >
          <h2 style={{
            color: 'var(--ocean-blue)',
            fontSize: '1.8rem',
            marginBottom: '20px'
          }}>
            User Management
          </h2>

          <div style={{ marginBottom: '25px' }}>
            <h3 style={{
              color: 'var(--ocean-blue)',
              fontSize: '1.3rem',
              marginBottom: '15px'
            }}>
              Customers
            </h3>
            <div style={{
              display: 'grid',
              gap: '12px'
            }}>
              {users.filter(u => u.role === 'customer').map(renderUserCard)}
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h3 style={{
              color: 'var(--ocean-blue)',
              fontSize: '1.3rem',
              marginBottom: '15px'
            }}>
              Retailers
            </h3>
            <div style={{
              display: 'grid',
              gap: '12px'
            }}>
              {users.filter(u => u.role === 'retailer').map(renderUserCard)}
            </div>
          </div>

          <div>
            <h3 style={{
              color: 'var(--ocean-blue)',
              fontSize: '1.3rem',
              marginBottom: '15px'
            }}>
              Wholesalers
            </h3>
            <div style={{
              display: 'grid',
              gap: '12px'
            }}>
              {users.filter(u => u.role === 'wholesaler').map(renderUserCard)}
            </div>
          </div>
        </div>

        {/* Product Management Section */}
        <div style={{
          flex: 1,
          minWidth: '300px',
          backgroundColor: 'var(--card-bg)',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 168, 204, 0.1)',
          transition: 'all 0.3s ease'
        }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.08)';
          }}
        >
          <h2 style={{
            color: 'var(--ocean-blue)',
            fontSize: '1.8rem',
            marginBottom: '20px'
          }}>
            Product Overview
          </h2>
          <div style={{
            display: 'grid',
            gap: '20px'
          }}>
            {products.map((product, index) => (
              <div
                key={product._id || product.id || index}
                style={{
                  padding: '20px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid var(--border-color)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h3 style={{
                  margin: '0 0 15px 0',
                  color: 'var(--ocean-blue)'
                }}>
                  {product.name}
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px'
                }}>
                  <p style={{ margin: 0, color: 'var(--text-main)' }}>
                    <strong>Category:</strong> {product.category}
                  </p>
                  <p style={{ margin: 0, color: 'var(--text-main)' }}>
                    <strong>Price:</strong> ${product.suggestedRetailPrice || product.wholesalePrice || product.price || 0}
                  </p>
                  <div style={{ margin: 0, marginTop: '10px', padding: '10px', backgroundColor: 'var(--input-bg)', borderRadius: '5px' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      <strong>Added By:</strong> {product.wholesaler?.name || product.wholesalerName || 'Unknown'}
                    </p>
                    <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem' }}>
                      <strong>Role:</strong> <span style={{
                        backgroundColor: '#e3f2fd',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        color: '#0d47a1',
                        fontSize: '0.8rem',
                        textTransform: 'capitalize'
                      }}>
                        {product.wholesaler?.role || 'Wholesaler'}
                      </span>
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <strong>Email:</strong> {product.wholesaler?.email || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteConfirmation('');
          setUserToDelete(null);
        }}
        title="⚠️ Confirm Deletion"
        showCancel={true}
        confirmText="Delete User"
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
            Warning: This action cannot be undone!
          </p>

          <p style={{ color: '#666', marginBottom: '20px' }}>
            You are about to permanently delete the user: <strong>{userToDelete?.name}</strong>
          </p>

          <p style={{ color: '#666', marginBottom: '10px' }}>
            To confirm, please type <strong style={{ color: '#d32f2f' }}>DELETE</strong> below:
          </p>

          <input
            type="text"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="Type DELETE to confirm"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #e0e0e0',
              fontSize: '1rem',
              boxSizing: 'border-box',
              fontFamily: 'monospace',
              textTransform: 'uppercase'
            }}
            autoFocus
          />

          {deleteConfirmation && deleteConfirmation !== 'DELETE' && (
            <p style={{
              color: '#d32f2f',
              fontSize: '0.9rem',
              marginTop: '8px',
              marginBottom: 0
            }}>
              Please type exactly "DELETE" to confirm
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default AdminDashboard;