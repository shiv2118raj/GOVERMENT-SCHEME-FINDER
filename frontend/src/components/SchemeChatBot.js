import axios from 'axios';
import { MessageSquare, Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import './SchemeChatBot.css';

const SchemeChatBot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am SchemeGenie. How can I help you today?'
    }
  ]); const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBoxRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const message = input.trim();
    if (!message) return;

    // Add user message to chat
    const userMessage = { sender: 'user', text: message };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Get bot response from backend
      const response = await axios.post('http://localhost:5002/chat', {
        message: message
      });

      // Add bot response to chat
      setMessages(prev => [...prev, { sender: 'bot', text: response.data.reply }]);
    } catch (error) {
      console.error('Error getting response from chatbot:', error);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: "⚠️ Sorry, I couldn't connect to the server. Please try again."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatContainerRef.current &&
        !chatContainerRef.current.contains(event.target) &&
        !event.target.closest('.chatbot-toggle')
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="chatbot-widget">
      {/* Floating Toggle Button */}
      <button
        className="chatbot-toggle"
        onClick={toggleChat}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className={`chatbot-container ${isOpen ? 'open' : ''}`}
        style={{ display: isOpen ? 'flex' : 'none' }}
      >
        <div className="chat-header">
          <span>🤖 SchemeGenie Assistant</span>
          <button className="close-btn" onClick={toggleChat}>
            <X size={18} />
          </button>
        </div>

        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender}`}
            >
              {message.text.split('\n').map((line, i) => (
                <p key={i} style={{ margin: '4px 0' }}>{line}</p>
              ))}
            </div>
          ))}
          {isTyping && (
            <div className="message bot typing">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            aria-label="Type your message"
          />
          <button type="submit" disabled={isTyping || !input.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SchemeChatBot;
