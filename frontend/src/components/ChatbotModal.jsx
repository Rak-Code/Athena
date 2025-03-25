import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const ChatbotModal = ({ show, onHide }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  // Automatically scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to send message to backend
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Create a new message object for user message
    const userMessage = {
      sender: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    // Update messages with user message
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Make API call to Spring Boot backend
      const response = await axios.post('http://localhost:8080/api/chat', {
        message: inputMessage
      }, {
        headers: {
          'Content-Type': 'application/json',
          // Optional: Add any additional headers like authorization if needed
        },
        timeout: 10000 // 10 seconds timeout
      });

      // Create a new message object for bot response
      const botMessage = {
        sender: 'bot',
        content: response.data.message,
        timestamp: new Date().toISOString()
      };

      // Update messages with bot response
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        sender: 'bot',
        content: error.response 
          ? error.response.data.message 
          : 'Sorry, there was an error processing your message.',
        timestamp: new Date().toISOString()
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  // Handle keypress for sending message on Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Athena AI Assistant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div 
          ref={chatContainerRef}
          className="chat-messages" 
          style={{
            height: '400px',
            overflowY: 'auto',
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.sender}`}
              style={{
                textAlign: msg.sender === 'user' ? 'right' : 'left',
                margin: '10px 0',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: msg.sender === 'user' ? '#333333' : '#e9ecef',
                color: msg.sender === 'user' ? 'white' : 'black',
                maxWidth: '70%',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                wordWrap: 'break-word'
              }}
            >
              {msg.content}
            </div>
          ))}
          {isLoading && (
            <div 
              className="loading"
              style={{
                textAlign: 'left',
                fontStyle: 'italic',
                color: '#6c757d',
                alignSelf: 'flex-start'
              }}
            >
              Typing...
            </div>
          )}
        </div>
        <Form onSubmit={handleSubmit}>
          <div className="d-flex">
            <Form.Control 
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="mr-2"
            />
            <Button 
              variant="dark" 
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
            >
              Send
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ChatbotModal;