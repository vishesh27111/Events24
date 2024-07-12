import React, { useState } from 'react';
import AWS from 'aws-sdk';
import '../css/Chatbot.css'

const ChatBot = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);

  AWS.config.region = 'us-east-1'; // Region
  AWS.config.credentials = new AWS.Credentials({
    accessKeyId: '', // Access key ID
    secretAccessKey: '', // Secret access key
    sessionToken: ''
});

  const lexRuntime = new AWS.LexRuntime();
  const botAlias = 'bot'; // or your bot alias
  const botName = 'EventChat'; // Replace with your bot name

  const handleChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const params = {
      botAlias,
      botName,
      inputText: userInput,
      userId: localStorage.getItem('userId'), // You might want to use a more specific ID
      sessionAttributes: {}
    };

    lexRuntime.postText(params, (err, data) => {
      if (err) {
        console.error("Error:", err);
      } else {
        setMessages([...messages, { from: 'user', text: userInput }, { from: 'bot', text: data.message }]);
        setUserInput(''); // Clear input after sending
      }
    });
  };

  return (
    <div className="chatbot-container">
      <form onSubmit={handleSubmit} className="chatbot-form">
        <input
          type="text"
          value={userInput}
          onChange={handleChange}
          placeholder="Ask me something..."
          className="chatbot-input"
        />
        <button type="submit">Send</button>
      </form>
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.from}`}>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatBot;
