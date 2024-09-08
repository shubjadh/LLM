# AI Chatbot Platform

This project is an AI-powered chatbot platform using Gemini AI, Node.js, and MongoDB.

## Features

- AI-powered responses using Gemini AI
- Conversation history storage in MongoDB
- RESTful API for chat interactions

## Installation

1. Clone the repository
2. Run `npm install`
3. Set up your `.env` file with your Gemini AI API key and MongoDB URI
    
    `.env file format:`
    ```
    NODE_ENV=development
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/ai-chatbot
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```
4. Run `npm start` to start the server

## API Endpoints

- POST /api/chat/send: Send a message to the chatbot
- GET /api/chat/history: Get conversation history

## Technologies Used

- [Node.js](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)
- [Express.js](https://expressjs.com/en/starter/installing.html)
- [MongoDB](https://www.mongodb.com/docs/)
- [Gemini AI](https://ai.google.dev/gemini-api/docs)

## Future Improvements

- Add user authentication
- Implement real-time chat using WebSockets
- Enhance error handling and input validation