import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../shared/ToastProvider';
import { updateProfile } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

function EditProfile() {
    const navigate = useNavigate();
    const toast = useToast();

    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        role: ''
    });
    const [loading, setLoading] = useState(true);
    const { logout } = useAuth(); // If we need to re-login or update context state (optional)

    useEffect(() => {
        // Load User Profile
        const storedUser = sessionStorage.getItem('user');
        if (!storedUser) {
            navigate('/'); // Or appropriate login
            return;
        }
        const user = JSON.parse(storedUser);
        setProfile(user);
        setLoading(false);
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(profile);
            // Context/Storage is already updated by authService.updateProfile
            toast.success("Profile updated successfully!");
            if (profile.role === 'retailer') navigate('/retailer/profile');
            else navigate('/customer/profile');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        }
    };

    const handleCancel = () => {
        if (profile.role === 'retailer') navigate('/retailer/profile');
        else navigate('/customer/profile');
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{
            maxWidth: '600px',
            margin: '40px auto',
            padding: '40px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            color: 'var(--text-main)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            animation: 'fadeIn 0.5s ease-out'
        }}>
            <style>{`
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            input:focus {
                outline: none;
                border-color: var(--ocean-blue) !important;
                box-shadow: 0 0 0 3px rgba(0, 168, 204, 0.2);
            }
         `}</style>
            <h2 style={{ color: 'var(--ocean-blue)', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '25px' }}>
                ✏️ Edit Profile
            </h2>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.95rem', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Full Name</label>
                    <input
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                        style={{
                            width: '100%', padding: '14px', borderRadius: '10px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            color: 'var(--text-main)',
                            fontSize: '1rem',
                            transition: 'all 0.3s ease'
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.95rem', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Email Address</label>
                    <input
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        required
                        type="email"
                        placeholder="Enter your email"
                        style={{
                            width: '100%', padding: '14px', borderRadius: '10px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            color: 'var(--text-main)',
                            fontSize: '1rem',
                            transition: 'all 0.3s ease'
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.95rem', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Phone Number</label>
                    <input
                        name="phone"
                        value={profile.phone || ''}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        style={{
                            width: '100%', padding: '14px', borderRadius: '10px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            color: 'var(--text-main)',
                            fontSize: '1rem',
                            transition: 'all 0.3s ease'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                    <button
                        type="submit"
                        style={{
                            flex: 1, padding: '14px', backgroundColor: 'var(--aqua-blue)', color: 'white',
                            border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.05rem',
                            transition: 'background 0.3s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = 'var(--ocean-blue)'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'var(--aqua-blue)'}
                    >
                        Save Changes
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        style={{
                            flex: 1, padding: '14px', backgroundColor: 'transparent', color: 'var(--text-secondary)',
                            border: '1px solid var(--border-color)', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.05rem'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditProfile;
