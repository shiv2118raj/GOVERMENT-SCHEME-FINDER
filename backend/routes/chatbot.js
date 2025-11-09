import express from 'express';
import { 
  schemeGenieChatbot,
  getChatHistory,
  clearChatHistory 
} from '../controllers/chatbotController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Chatbot endpoints
router.post('/', protect, schemeGenieChatbot);
router.get('/history', protect, getChatHistory);
router.delete('/history', protect, clearChatHistory);

export default router;
