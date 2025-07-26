import React, { useState, useEffect, useRef } from "react";
import { 
  FaHeadset, 
  FaComments, 
  FaRobot, 
  FaPhoneAlt, 
  FaEnvelope,
  FaWhatsapp,
  FaQuestionCircle,
  FaPaperPlane,
  FaHistory,
  FaSearch,
  FaFileDownload,
  FaCalendarAlt,
  FaUser
} from "react-icons/fa";
import "../css/CustomerSupport.css";
import ChatBot from "../../../Components/Component/ChatBot";

const CustomerSupport = () => {
  const [activeTab, setActiveTab] = useState('bot');
  const [query, setQuery] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [ticketHistory] = useState([
    { id: 'TK001', date: '2024-01-15', subject: 'Transaction Failed', status: 'Resolved' },  ]);
    
  // Refs for chat containers
  const chatMessagesRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const commonQueries = [
    "Reset Password",
    "Block Debit Card",
    "Transaction Issues",
    "Update KYC",
    "Loan Enquiry",
    "Account Statement"
  ];

  const handleSendMessage = () => {
    if (query.trim()) {
      setChatMessages([...chatMessages, { type: 'user', text: query }]);
      // Simulate bot response
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          type: 'bot', 
          text: "Thank you for your message. Our support team will respond shortly." 
        }]);
      }, 1000);
      setQuery('');
    }
  };

  const handleAutoQuery = (queryText) => {
    // Directly add the message without updating the input field
    setChatMessages([...chatMessages, { type: 'user', text: queryText }]);
    
    // Simulate bot response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        type: 'bot', 
        text: "Thank you for your message. Our support team will respond shortly." 
      }]);
    }, 1000);
  };
  
  // Handle custom bot message handling if needed
  const handleBotMessageSend = (message, updatedMessages) => {
    console.log("Message from bot:", message);
    // You can add custom handling here if needed
  };

  return (
    <div className="alerts-page">
      <div className="alerts-content">
        <div className="alerts-header">
          <FaHeadset className="header-icon" />
          <h4>24/7 Customer Support</h4>
        </div>

        <div className="support-grid">
          <div className="support-channels">
            <div className="channel-card">
              <FaPhoneAlt className="channel-icon" />
              <h6>Call Us</h6>
              <p>1800-123-4567</p>
              <span>24/7 Toll Free</span>
            </div>
            <div className="channel-card">
              <FaWhatsapp className="channel-icon" />
              <h6>WhatsApp</h6>
              <p>+91 98765-43210</p>
              <span>Quick Responses</span>
            </div>
            <div className="channel-card">
              <FaEnvelope className="channel-icon" />
              <h6>Email Support</h6>
              <p>support@bank.com</p>
              <span>24hr Response Time</span>
            </div>
          </div>

          <div className="support-tabs">
            {/* <button 
              className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <FaComments /> Live Chat
            </button> */}
            <button 
              className={`tab-btn ${activeTab === 'bot' ? 'active' : ''}`}
              onClick={() => setActiveTab('bot')}
            >
              <FaRobot /> Chat Bot
            </button>
            <button 
              className={`tab-btn ${activeTab === 'tickets' ? 'active' : ''}`}
              onClick={() => setActiveTab('tickets')}
            >
              <FaHistory /> Ticket History
            </button>
          </div>

          <div className="support-content">
            {activeTab === 'chat' && (
              <div className="chat-section">
                <div className="chat-messages" ref={chatMessagesRef}>
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`message ${msg.type}`}>
                      {msg.text}
                    </div>
                  ))}
                </div>
                <div className="quick-queries">
                  {commonQueries.map(query => (
                    <button key={query} className="query-btn"
                    onClick={() =>handleAutoQuery(query)} 
                    >
                      {query}
                    </button>
                  ))}
                </div>
                <div className="chat-input">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type your message here..."
                  />
                  <button onClick={handleSendMessage}>
                    <FaPaperPlane />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'tickets' && (
              <div className="tickets-section">
                <div className="tickets-header">
                  <h5>Support Tickets</h5>
                  <div className="ticket-search">
                    <FaSearch />
                    <input type="text" placeholder="Search tickets..." />
                  </div>
                </div>
                <div className="tickets-list">
                  {ticketHistory.map(ticket => (
                    <div key={ticket.id} className="ticket-card">
                      <div className="ticket-info">
                        <span className="ticket-id">{ticket.id}</span>
                        <span className="ticket-date">{ticket.date}</span>
                      </div>
                      <h6>{ticket.subject}</h6>
                      <span className={`ticket-status ${ticket.status.toLowerCase()}`}>
                        {ticket.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'bot' && (
              <ChatBot onSendMessage={handleBotMessageSend} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;