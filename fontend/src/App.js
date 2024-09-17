import React, { useState, useEffect, useRef } from 'react';
import { Send, RefreshCcw, Zap, Sun, Eye } from 'lucide-react';
import axios from 'axios';
import './App.css';

const ChatbotApp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  const chatMainRef = useRef(null);
  const API_BASE_URL = 'http://localhost:3000/api/chat';

  const sendMessageToBackend = async (message) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/send`, { message });
      return response.data;
    } catch (error) {
      console.error('Error sending message to backend:', error);
      throw error;
    }
  };

  const sendMessage = async (messageText) => {
    if (messageText.trim() === '') return;
    
    const userMessage = { text: messageText, user: true };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToBackend(messageText);
      const botMessage = { text: response.response, user: false };
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setCurrentMessage(botMessage.text);
      setCharIndex(0);
    } catch (error) {
      console.error('Error in sendMessage:', error);
      const errorMessage = { text: "Sorry, I couldn't process that request.", user: false };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = (suggestion) => {
    sendMessage(suggestion);
  };

  useEffect(() => {
    if (currentMessage && charIndex < currentMessage.length) {
      const timer = setTimeout(() => {
        setCharIndex(prevIndex => prevIndex + 1);
      }, 20);

      return () => clearTimeout(timer);
    }
  }, [currentMessage, charIndex]);

  useEffect(() => {
    if (chatMainRef.current) {
      chatMainRef.current.scrollTop = chatMainRef.current.scrollHeight;
    }
  }, [messages]);

  const displayedText = currentMessage.slice(0, charIndex);

  const handleRefresh = () => {
    setMessages([]);
    setInput('');
    setIsLoading(false);
    setCurrentMessage('');
    setCharIndex(0);
    console.log('Chat refreshed');
  };

  const formatMessage = (text) => {
    const codeBlockRegex = /```[\s\S]*?```/g;
    const parts = text.split(codeBlockRegex);
    const codeBlocks = text.match(codeBlockRegex) || [];
    
    return parts.reduce((acc, part, index) => {
      acc.push(
        <span key={`text-${index}`}>
          {part.split('\n').map((line, lineIndex) => (
            <React.Fragment key={`line-${lineIndex}`}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </span>
      );
      if (codeBlocks[index]) {
        acc.push(
          <pre key={`code-${index}`} className="code-block">
            {codeBlocks[index].replace(/```/g, '').trim()}
          </pre>
        );
      }
      return acc;
    }, []);
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>Insight Chat</h1>
        <button onClick={handleRefresh} className="refresh-button" aria-label="Refresh chat">
          <RefreshCcw size={24} />
        </button>
      </header>
      <main className="chat-main" ref={chatMainRef}>
        {messages.length === 0 ? (
          <div className="suggestion-buttons">
            <button className="suggestion-button" onClick={() => handleSuggestion("Text inviting friend to wedding")}>
              <Zap className="suggestion-icon" size={24} />
              <span>Text inviting friend to wedding</span>
            </button>
            <button className="suggestion-button" onClick={() => handleSuggestion("Morning routine for productivity")}>
              <Sun className="suggestion-icon" size={24} />
              <span>Morning routine for productivity</span>
            </button>
            <button className="suggestion-button" onClick={() => handleSuggestion("Count the number of items in an image")}>
              <Eye className="suggestion-icon" size={24} />
              <span>Count the number of items in an image</span>
            </button>
          </div>
        ) : (
          <div className="message-list">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.user ? 'user-message' : 'bot-message'}`}>
                {message.user ? formatMessage(message.text) : 
                  (index === messages.length - 1 ? formatMessage(displayedText) : formatMessage(message.text))}
              </div>
            ))}
            {isLoading && <div className="message bot-message">Thinking...</div>}
          </div>
        )}
      </main>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder="Ask Anything!"
          className="message-input"
          disabled={isLoading}
        />
        <button onClick={() => sendMessage(input)} className="send-button" disabled={isLoading}>
          <Send size={24} />
        </button>
      </div>
    </div>
  );
};

export default ChatbotApp;