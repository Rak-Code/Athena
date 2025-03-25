import React, { useState } from 'react';
import ChatbotModal from './ChatbotModal';

const ChatbotButton = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div 
        className="chatbot-floating-button" 
        onClick={handleOpenModal}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '70px',
          height: '70px',
          backgroundColor: 'black',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          zIndex: 1000,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        }}
      >
        <img 
          src="/ChatBot.svg" 
          alt="Chatbot" 
          style={{
            width: '70px',
            height: '70px',
            objectFit: 'contain'
          }}
        />
      </div>

      <ChatbotModal 
        show={showModal} 
        onHide={handleCloseModal} 
      />
    </>
  );
};

export default ChatbotButton;