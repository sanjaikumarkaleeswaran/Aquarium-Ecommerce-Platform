import React, { useState, useEffect } from 'react';
import { getProductReviews, createReview, deleteReview } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';

const ProductReviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const data = await getProductReviews(productId);
            setReviews(data.reviews || []);
            setLoading(false);
        } catch (err) {
            console.error('Failed to load reviews', err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!user) {
            alert('Please login to leave a review');
            return;
        }

        try {
            await createReview(productId, rating, comment);
            setComment('');
            setRating(5);
            fetchReviews(); // Refresh list
            alert('Review submitted!');
        } catch (err) {
            setError(err.message || 'Failed to submit review');
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            await deleteReview(reviewId);
            fetchReviews();
        } catch (err) {
            alert('Failed to delete review');
        }
    };

    return (
        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: 'var(--card-bg)', borderRadius: '15px' }}>
            <h2 style={{ color: 'var(--ocean-blue)', marginBottom: '20px' }}>Reviews ({reviews.length})</h2>

            {/* Review Form */}
            {user && user.role === 'customer' && (
                <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Write a Review</h3>
                    {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Rating:</label>
                        <select
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            style={{ padding: '8px', borderRadius: '5px', width: '100px' }}
                        >
                            {[5, 4, 3, 2, 1].map(num => (
                                <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Comment:</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="3"
                            required
                            style={{ width: '100%', padding: '10px' }}
                        />
                    </div>

                    <button type="submit" style={{ padding: '10px 20px' }}>Submit Review</button>
                </form>
            )}

            {/* Review List */}
            {loading ? (
                <p>Loading reviews...</p>
            ) : reviews.length === 0 ? (
                <p>No reviews yet. Be the first to review!</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {reviews.map(review => (
                        <div key={review._id} style={{ padding: '15px', borderBottom: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <strong>{review.user?.name || 'Anonymous'}</strong>
                                <span style={{ color: '#ffbf00' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                            </div>
                            <p style={{ marginTop: '10px', color: 'var(--text-main)' }}>{review.comment}</p>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                            {(user && (user._id === review.user._id || user.role === 'admin')) && (
                                <button
                                    onClick={() => handleDelete(review._id)}
                                    style={{ marginLeft: '10px', fontSize: '0.8rem', padding: '4px 8px', backgroundColor: '#ff6b6b' }}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductReviews;
