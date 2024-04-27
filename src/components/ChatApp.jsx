import React, { useState } from 'react';
import ChatHistory from './ChatHIstory';
import UserInput from './UserInput';

const ChatApp = () => {
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I assist you?', type: 'bot' },
  ]);

  const handleUserInput = (text) => {
    setMessages([...messages, { text, type: 'user' }]);

    setTimeout(() => {
      setMessages([...messages, { text: 'Sorry, I am a mock bot. I cannot assist you.', type: 'bot' }]);
    }, 1000);
  };

  return (
    <div className="chat-app">
      <header className="header">
        <h1>Chat with Me!</h1>
      </header>
      <div className="chat-container">
        <div className="chat-history-container">
          <ChatHistory messages={messages} />
        </div>
        <div className="new-chat-container">
          <UserInput onSubmit={handleUserInput} />
        </div>
      </div>
      <footer className="footer">
        <p>© 2024 Virtual Psychiatrist Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ChatApp;
