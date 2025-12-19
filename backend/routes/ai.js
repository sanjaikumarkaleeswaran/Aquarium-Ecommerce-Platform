import express from 'express';
import { chatWithDrFish } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', chatWithDrFish);

export default router;
