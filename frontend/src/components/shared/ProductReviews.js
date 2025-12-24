import React, { useState, useEffect } from 'react';
import { getProductReviews, createReview, deleteReview } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';
import './ProductReviews.css';

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
        <div className="reviews-section">
            <h2 className="reviews-title">Reviews ({reviews.length})</h2>

            {/* Review Form */}
            {user && user.role === 'customer' && (
                <form onSubmit={handleSubmit} className="review-form">
                    <h3 className="form-title">Write a Review</h3>
                    {error && <p className="form-error">{error}</p>}

                    <div className="form-group">
                        <label className="form-label">Rating:</label>
                        <select
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            className="rating-select"
                        >
                            {[5, 4, 3, 2, 1].map(num => (
                                <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Comment:</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="3"
                            required
                            className="comment-textarea"
                        />
                    </div>

                    <button type="submit" className="submit-btn">Submit Review</button>
                </form>
            )}

            {/* Review List */}
            {loading ? (
                <p className="loading-text">Loading reviews...</p>
            ) : reviews.length === 0 ? (
                <p className="no-reviews-text">No reviews yet. Be the first to review!</p>
            ) : (
                <div className="reviews-list">
                    {reviews.map(review => (
                        <div key={review._id} className="review-card">
                            <div className="review-header">
                                <strong className="reviewer-name">{review.user?.name || 'Anonymous'}</strong>
                                <span className="review-stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                            </div>
                            <p className="review-comment">{review.comment}</p>
                            <div className="review-footer">
                                <span className="review-date">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                                {(user && (user._id === review.user._id || user.role === 'admin')) && (
                                    <button
                                        onClick={() => handleDelete(review._id)}
                                        className="delete-btn"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductReviews;
