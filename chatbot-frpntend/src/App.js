import React, { useState } from 'react';
import { Send, Zap, Sun, Eye } from 'lucide-react';
import './App.css';
import axios from 'axios'; // Make sure to install axios: npm install axios

const ChatbotApp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessageToBackend = async (message) => {
    try {
      // Replace 'YOUR_BACKEND_URL' with your actual backend URL
      const response = await axios.post('YOUR_BACKEND_URL/chat', { message });
      return response.data;
    } catch (error) {
      console.error('Error sending message to backend:', error);
      throw error;
    }
  };

  const sendMessage = async () => {
    if (input.trim() === '') return;
    
    const userMessage = { text: input, user: true };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToBackend(input);
      const botMessage = { text: response.message, user: false };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      const errorMessage = { text: "Sorry, I couldn't process that request.", user: false };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = async (suggestion) => {
    setMessages(prevMessages => [...prevMessages, { text: suggestion, user: true }]);
    setIsLoading(true);

    try {
      const response = await sendMessageToBackend(suggestion);
      const botMessage = { text: response.message, user: false };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      const errorMessage = { text: "Sorry, I couldn't process that request.", user: false };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>Nasty AI</h1>
      </header>
      <main className="chat-main">
        {messages.length === 0 ? (
          <div className="suggestion-buttons">
            <button className="suggestion-button" onClick={() => handleSuggestion("Text inviting friend to wedding")}>
              <Zap className="suggestion-icon" />
              <span>Text inviting friend to wedding</span>
            </button>
            <button className="suggestion-button" onClick={() => handleSuggestion("Morning routine for productivity")}>
              <Sun className="suggestion-icon" />
              <span>Morning routine for productivity</span>
            </button>
            <button className="suggestion-button" onClick={() => handleSuggestion("Count the number of items in an image")}>
              <Eye className="suggestion-icon" />
              <span>Count the number of items in an image</span>
            </button>
          </div>
        ) : (
          <div className="message-list">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.user ? 'user-message' : 'bot-message'}`}>
                {message.text}
              </div>
            ))}
            {isLoading && <div className="message bot-message">Processing.......</div>}
          </div>
        )}
      </main>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask Anything!"
          className="message-input"
          disabled={isLoading}
        />
        <button onClick={sendMessage} className="send-button" disabled={isLoading}>
          <Send />
        </button>
      </div>
    </div>
  );
};

export default ChatbotApp;