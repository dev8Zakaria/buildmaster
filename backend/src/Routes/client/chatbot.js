import express from 'express';
import { handleChatMessage } from '../../Controllers/client/chatbotController.js';
import { authMidlleware } from '../../Midllewars/authMidlleware.js';

const router = express.Router();

// Define Chatbot route
// Typically we want valid users, but we can make it optional or strictly authenticated.
// user requires 'authenticateUser' middleware if we want req.user populated.
// If guest access is allowed, make middleware optional or handle missing user in controller.
// For now, let's keep it open but use middleware if available on frontend.
router.post('/', handleChatMessage);

export default router;
