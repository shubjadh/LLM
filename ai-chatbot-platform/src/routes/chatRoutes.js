const express = require('express');
const { sendMessage, getConversationHistory } = require('../controllers/chatController');

const router = express.Router();

router.post('/send', sendMessage);
router.get('/history', getConversationHistory);

module.exports = router;