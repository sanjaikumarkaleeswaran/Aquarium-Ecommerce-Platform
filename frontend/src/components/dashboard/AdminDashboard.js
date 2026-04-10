import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../shared/Header';
import Modal from '../shared/Modal';
import { getPendingApprovals, approveUser, rejectUser, getAllUsers, deactivateUser, activateUser, deleteUser } from '../../services/adminService';
import { getProducts } from '../../services/productService';
import './AdminDashboard.css';

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
      const [approvalsRes, usersRes, productsRes] = await Promise.all([
        getPendingApprovals(),
        getAllUsers(),
        getProducts()
      ]);

      setPendingApprovals(approvalsRes.users || []);
      setUsers(usersRes.users || []);
      setProducts(productsRes.products || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (userId, userName) => {
    if (!window.confirm(`Approve ${userName}?`)) return;
    try {
      await approveUser(userId, 'Approved by admin');
      alert(`${userName} approved!`);
      fetchData();
    } catch (error) {
      alert('Failed to approve user.');
    }
  };

  const handleDeactivate = async (userId, userName) => {
    if (!window.confirm(`Deactivate ${userName}?`)) return;
    try {
      await deactivateUser(userId);
      fetchData();
    } catch (error) {
      alert('Failed to deactivate.');
    }
  };

  const handleActivate = async (userId, userName) => {
    try {
      await activateUser(userId);
      fetchData();
    } catch (error) {
      alert('Failed to activate.');
    }
  };

  const renderUserCard = (user) => {
    const isActive = user.isActive !== false;

    return (
      <div key={user._id || user.id} className={`user-item-card ${!isActive ? 'inactive' : ''}`}>
        <div style={{ marginBottom: '12px' }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold ocean-blue" style={{ margin: 0 }}>
                {user.name}
                {!isActive && <span className="show-mobile" style={{ color: 'red', fontSize: '0.7rem' }}> (OFF)</span>}
              </p>
              <p className="text-secondary" style={{ margin: '2px 0', fontSize: '0.85rem' }}>{user.email}</p>
              <span style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                color: user.role === 'wholesaler' ? '#e67e22' : '#3498db'
              }}>
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="user-actions flex flex-wrap" style={{ gap: '8px' }}>
          {isActive ? (
            <button
              onClick={() => handleDeactivate(user._id || user.id, user.name)}
              style={{ backgroundColor: '#ff9800', padding: '4px 10px', fontSize: '0.8rem' }}
            >
              Deactivate
            </button>
          ) : (
            <button
              onClick={() => handleActivate(user._id || user.id, user.name)}
              style={{ backgroundColor: '#4caf50', padding: '4px 10px', fontSize: '0.8rem' }}
            >
              Activate
            </button>
          )}
          <button
            onClick={() => {
              setUserToDelete({ id: user._id || user.id, name: user.name });
              setShowDeleteModal(true);
            }}
            style={{ backgroundColor: '#f44336', padding: '4px 10px', fontSize: '0.8rem' }}
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="dashboard-loading text-center flex items-center justify-center">
        <h2 className="animate-fade-in">Initializing Admin Panel...</h2>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <Header
        title="Admin Control Center"
        subtitle="Manage the ecosystem: Users, Approvals, and Inventory"
      />

      {/* Pending Approvals */}
      {pendingApprovals.length > 0 && (
        <div className="approvals-panel">
          <h2 style={{ color: '#e67e22', display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0 }}>
            <span>⚠️</span> Pending Approvals ({pendingApprovals.length})
          </h2>
          <div className="approvals-grid">
            {pendingApprovals.map(user => (
              <div key={user._id} className="card approval-card">
                <h3 style={{ margin: '0 0 10px 0' }}>{user.name}</h3>
                <div style={{ fontSize: '0.9rem', marginBottom: '15px' }}>
                  <p style={{ margin: '4px 0' }}><strong>Role:</strong> {user.role.toUpperCase()}</p>
                  <p style={{ margin: '4px 0' }}><strong>Email:</strong> {user.email}</p>
                  {user.businessName && <p style={{ margin: '4px 0' }}><strong>Business:</strong> {user.businessName}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleApprove(user._id, user.name)} className="btn-success" style={{ flex: 1, padding: '8px' }}>Approve</button>
                  <button onClick={() => {
                     const reason = prompt('Reason for rejection?');
                     if(reason) rejectUser(user._id, reason).then(() => fetchData());
                  }} className="btn-danger" style={{ flex: 1, padding: '8px', backgroundColor: '#e74c3c' }}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="admin-main-grid">
        {/* User Management */}
        <div className="card admin-panel-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="ocean-blue" style={{ marginTop: 0 }}>User Directory</h2>
          
          <div className="user-role-section">
            <h3 style={{ fontSize: '1.2rem' }}>Wholesalers</h3>
            <div className="responsive-grid" style={{ gridTemplateColumns: '1fr' }}>
              {users.filter(u => u.role === 'wholesaler').map(renderUserCard)}
            </div>
          </div>

          <div className="user-role-section">
            <h3 style={{ fontSize: '1.2rem' }}>Retailers</h3>
            <div className="responsive-grid" style={{ gridTemplateColumns: '1fr' }}>
              {users.filter(u => u.role === 'retailer').map(renderUserCard)}
            </div>
          </div>

          <div className="user-role-section">
            <h3 style={{ fontSize: '1.2rem' }}>Customers</h3>
            <div className="responsive-grid" style={{ gridTemplateColumns: '1fr' }}>
              {users.filter(u => u.role === 'customer').map(renderUserCard)}
            </div>
          </div>
        </div>

        {/* Inventory Overview */}
        <div className="card admin-panel-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="ocean-blue" style={{ marginTop: 0 }}>Global Inventory</h2>
          <div className="admin-products-list">
             {products.length === 0 ? (
               <p className="text-secondary">No global products found.</p>
             ) : products.map(product => (
               <div key={product._id} className="admin-product-card">
                  <div className="flex justify-between items-center">
                    <h4 style={{ margin: 0 }}>{product.name}</h4>
                    <span className="font-bold">₹{product.suggestedRetailPrice || product.price || product.priceCustomer || 0}</span>
                  </div>
                  <div className="flex justify-between" style={{ marginTop: '10px', fontSize: '0.85rem' }}>
                    <span className="text-secondary">By: {product.wholesalerName || 'Store'}</span>
                    <span style={{ color: (product.stock || 0) < 10 ? 'red' : 'green' }}>Qty: {product.stock || 0}</span>
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
        title="Permanently Delete User"
        showCancel={true}
        confirmText="Confirm DELETE"
        onConfirm={async () => {
          if (deleteConfirmation === 'DELETE') {
            await deleteUser(userToDelete.id);
            alert('User deleted.');
            setShowDeleteModal(false);
            fetchData();
          } else {
            alert('Type DELETE to confirm');
          }
        }}
      >
        <div style={{ padding: '10px 0' }}>
          <p>This will permanently remove <strong>{userToDelete?.name}</strong>. Type <strong>DELETE</strong> to confirm.</p>
          <input
            type="text"
            className="input-field"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value.toUpperCase())}
            placeholder="Type DELETE"
            style={{ marginTop: '15px' }}
          />
        </div>
      </Modal>
    </div>
  );
}

export default AdminDashboard;
efault AdminDashboard;