import React from 'react';

const ChatHistory = ({ messages }) => (
  <div className="chat-history">
    {messages.map((message, index) => (
      <div key={index} className={`message ${message.type}`}>
        {message.text}
      </div>
    ))}
  </div>
);

export default ChatHistory;
