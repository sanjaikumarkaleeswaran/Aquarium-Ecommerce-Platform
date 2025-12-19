import express from 'express';
import { getProductReviews, createReview, deleteReview } from '../controllers/reviewController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/', authenticate, createReview);
router.delete('/:id', authenticate, deleteReview);

export default router;
