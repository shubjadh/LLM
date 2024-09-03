import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, user: true };
    setMessages([...messages, userMessage]);
    setInput('');
    
    try {
      const response = await axios.post('http://localhost:3001/chat', { message: input });
      const botMessage = { text: response.data.response, user: false };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } 
    
    catch(error) {
      console.error('Error:', error);
      const errorMessage = { text: 'Sorry, an error occured.', user: false };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.user ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs p-3 rounded-lg ${message.user ? 'bg-blue-500 text-white' : 'bg-white'}`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 p-2 border rounded-lg"
            placeholder="Type a message..."
          />
          <button onClick={sendMessage} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Send</button>
        </div>
      </div>
    </div>
  );
};

export default App;
               
        
        
      