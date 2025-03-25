import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const ChatbotModal = ({ show, onHide }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to send message to backend
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Create a new message object for user message
    const userMessage = {
      sender: 'user',
      content: inputMessage
    };

    // Update messages with user message
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Make API call to Spring Boot backend
      const response = await axios.post('http://localhost:8080/api/chat', {
        message: inputMessage
      });

      // Create a new message object for bot response
      const botMessage = {
        sender: 'bot',
        content: response.data.message
      };

      // Update messages with bot response
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        sender: 'bot',
        content: 'Sorry, there was an error processing your message.'
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
          className="chat-messages" 
          style={{
            height: '400px',
            overflowY: 'auto',
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: '#f8f9fa'
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
                backgroundColor: msg.sender === 'user' ? '#333333' : '#e9ecef', // Changed to a softer black
                color: msg.sender === 'user' ? 'white' : 'black',
                maxWidth: '70%',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start'
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
                color: '#6c757d'
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
              className="mr-2"
            />
            <Button 
              variant="dark" 
              type="submit"
              disabled={isLoading}
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