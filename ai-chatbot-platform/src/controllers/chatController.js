const geminiService = require('../services/geminiService');
const Conversation = require('../models/conversation');

exports.sendMessage = async (req, res, next) => {
  try {
    console.log('Received message:', req.body.message);
    const { message } = req.body;
    
    console.log('Calling geminiService.generateResponse...');
    const startTime = Date.now();
    const aiResponse = await geminiService.generateResponse(message);
    const endTime = Date.now();
    console.log(`AI response generated in ${endTime - startTime}ms:`, aiResponse);
    
    console.log('Saving conversation to database...');
    const savedConversation = await Conversation.create({ userMessage: message, aiResponse });
    console.log('Conversation saved:', savedConversation);

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    next(error);
  }
};

exports.getConversationHistory = async (req, res, next) => {
  try {
    console.log('Fetching conversation history...');
    const history = await Conversation.find().sort('-createdAt').limit(10);
    console.log('Fetched history:', history);
    res.json(history);
  } catch (error) {
    console.error('Error in getConversationHistory:', error);
    next(error);
  }
};