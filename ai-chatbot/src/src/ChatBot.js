import React, { useState } from 'react';
import axios from 'axios';
import './ChatBot.css';

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages([...messages, userMsg]);
    setInput('');

    try {
      // Hitting your backend API endpoint (you'll create this)
      const res = await axios.post('http://localhost:5000/chat', { message: input });
      const botMsg = { sender: 'bot', text: res.data.reply };
      setMessages(old => [...old, botMsg]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">💬 Scheme Seva AI Buddy</div>
      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.sender}`}>
            {m.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="chat-input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">➤</button>
      </form>
    </div>
  );
}

export default ChatBot;