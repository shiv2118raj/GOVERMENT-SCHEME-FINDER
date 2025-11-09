import { useState } from "react";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hello! I am SchemeGenie, your AI Scheme Assistant. Ask me about any government scheme or required documents.",
    },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage, { sender: "bot", text: "⏳ Typing..." }]);
    setInput("");

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          sender: "bot",
          text: data.response || "Sorry, I couldn't get a response right now. Please try again later.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { sender: "bot", text: "⚠️ Server connection failed. Try again later." },
      ]);
      console.error(error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">💬 SchemeGenie Assistant</div>
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`msg ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
};

export default ChatBot;
