import Review from '../models/Review.js';
import RetailerProduct from '../models/RetailerProduct.js';

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });

        res.json({ reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private (Customer only)
export const createReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user._id;

        // Check if product exists
        const product = await RetailerProduct.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user already reviewed
        const alreadyReviewed = await Review.findOne({
            user: userId,
            product: productId
        });

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Product already reviewed' });
        }

        const review = await Review.create({
            user: userId,
            product: productId,
            rating: Number(rating),
            comment
        });

        // Populate user details for immediate display
        await review.populate('user', 'name');

        res.status(201).json({ review });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Admin or Review Owner)
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check ownership or admin status
        if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await review.deleteOne();
        res.json({ message: 'Review removed' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
