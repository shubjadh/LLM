const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  userMessage: {
    type: String,
    required: true,
  },
  aiResponse: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);