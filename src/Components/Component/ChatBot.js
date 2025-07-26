import React, { useState, useEffect, useRef } from "react";
import { 
  FaRobot, 
  FaPaperPlane,
  FaFileDownload,
} from "react-icons/fa";
import "../css/ChatBot.css";

const ChatBot = ({ initialMessages = [], onSendMessage }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState(initialMessages.length > 0 ? initialMessages : [
    // Default initial welcome message
    { 
      type: 'bot', 
      text: '👋 Hi there! Welcome to ABC Bank. How can I assist you today?' 
    },
    // Default initial options
    { 
      type: 'bot', 
      options: [
        { label: "💸 Transactions", value: "transactions" },
        { label: "💳 Card Services", value: "cardServices" },
        { label: "🧾 Account Statement", value: "accountStatement" },
        { label: "👨‍💼 Talk to Agent", value: "talkToAgent" },
        { label: "📞 Contact Support", value: "contactSupport" }
      ]
    }
  ]);
  
  // Ref for chat container
  const messagesRef = useRef(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (query.trim()) {
      // Add user message to chat
      const updatedMessages = [...messages, { type: 'user', text: query }];
      setMessages(updatedMessages);
      
      // Call parent callback if provided
      if (onSendMessage) {
        onSendMessage(query, updatedMessages);
      }
      
      // Default bot response if no callback provided
      if (!onSendMessage) {
        // Simulate bot response
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            type: 'bot', 
            text: "I understand you're asking about " + query + ". Let me help you with that." 
          }]);
          
          // Show main options again
          setTimeout(() => {
            setMessages(prev => [...prev, { 
              type: 'bot', 
              text: "What else would you like to know?",
              options: [
                { label: "💸 Transactions", value: "transactions" },
                { label: "💳 Card Services", value: "cardServices" },
                { label: "🧾 Account Statement", value: "accountStatement" },
                { label: "👨‍💼 Talk to Agent", value: "talkToAgent" }
              ]
            }]);
          }, 1000);
        }, 1000);
      }
      
      setQuery('');
    }
  };
  
  const handleOption = (option) => {
    // Add user selection to chat
    const updatedMessages = [...messages, { 
      type: 'user', 
      text: getOptionLabel(option)
    }];
    setMessages(updatedMessages);
    
    // Process different options
    setTimeout(() => {
      switch(option) {
        case 'transactions':
          setMessages(prev => [...prev, { 
            type: 'bot', 
            text: "Please select a time period for your transactions:",
            dateRange: true,
            context: 'transactions'
          }]);
          break;
          
        case 'cardServices':
          setMessages(prev => [...prev, { 
            type: 'bot', 
            text: "What would you like to do with your card?",
            options: [
              { label: "Block Card", value: "blockCard" },
              { label: "Request New Card", value: "newCard" },
              { label: "Report Lost Card", value: "lostCard" },
              { label: "Change PIN", value: "changePin" }
            ],
            context: 'cardServices'
          }]);
          break;
          
        case 'accountStatement':
          setMessages(prev => [...prev, { 
            type: 'bot', 
            text: "Please select a time period for your account statement:",
            dateRange: true,
            context: 'accountStatement'
          }]);
          break;
          
        case 'talkToAgent':
          setMessages(prev => [...prev, { 
            type: 'bot', 
            text: "I'm connecting you with a customer service representative. Please wait a moment..."
          }]);
          
          // Simulate agent connection
          setTimeout(() => {
            setMessages(prev => [...prev, { 
              type: 'bot', 
              text: "Agent Alex has joined the chat. How may I help you today?"
            }]);
          }, 2000);
          break;
          
        case 'contactSupport':
          setMessages(prev => [...prev, { 
            type: 'bot', 
            text: "You can reach our support team through:",
            options: [
              { label: "📞 Call 1800-123-4567", value: "call" },
              { label: "📧 Email support@bank.com", value: "email" },
              { label: "📱 WhatsApp +91 98765-43210", value: "whatsapp" }
            ],
            context: 'contactSupport'
          }]);
          break;
          
        default:
          setMessages(prev => [...prev, { 
            type: 'bot', 
            text: "I'm not sure how to help with that. Please try another option."
          }]);
      }
    }, 1000);
  };
  
  const handleOptionSelection = (context, option) => {
    // Add user selection to chat
    setMessages([...messages, { 
      type: 'user', 
      text: option.label
    }]);
    
    // Process different context-specific options
    setTimeout(() => {
      switch(context) {
        case 'cardServices':
          if (option.value === 'blockCard') {
            setMessages(prev => [...prev, { 
              type: 'bot', 
              text: "Your card has been temporarily blocked. You will receive an SMS confirmation shortly."
            }]);
          } else if (option.value === 'newCard') {
            setMessages(prev => [...prev, { 
              type: 'bot', 
              text: "I've initiated a request for a new card. It should arrive within 5-7 business days."
            }]);
          } else {
            setMessages(prev => [...prev, { 
              type: 'bot', 
              text: "I've logged your request for " + option.label + ". Our team will process it shortly."
            }]);
          }
          break;
          
        case 'contactSupport':
          setMessages(prev => [...prev, { 
            type: 'bot', 
            text: "Thank you for choosing " + option.label + ". Is there anything else I can help you with?"
          }]);
          break;
          
        default:
          setMessages(prev => [...prev, { 
            type: 'bot', 
            text: "Thank you for selecting " + option.label + ". Our team will assist you with this request."
          }]);
      }
      
      // Show main options again
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          text: "What else would you like to know?",
          options: [
            { label: "💸 Transactions", value: "transactions" },
            { label: "💳 Card Services", value: "cardServices" },
            { label: "🧾 Account Statement", value: "accountStatement" },
            { label: "👨‍💼 Talk to Agent", value: "talkToAgent" }
          ]
        }]);
      }, 1000);
    }, 1000);
  };
  
  const handleDateRangeSelection = (context, range) => {
    // Add user selection to chat
    setMessages([...messages, { 
      type: 'user', 
      text: range === 'last7days' ? 'Last 7 Days' : 
            range === 'thisMonth' ? 'This Month' : 'Custom Range'
    }]);
    
    // Process date range selection
    setTimeout(() => {
      if (range === 'customRange') {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          text: "Please select your custom date range:",
          // In a real app, you would include a date picker component here
          options: [
            { label: "Last 14 days", value: "last14days" },
            { label: "Last 30 days", value: "last30days" },
            { label: "Last 3 months", value: "last3months" }
          ],
          context: context + 'CustomRange'
        }]);
      } else {
        // Show mock transaction data or statement
        if (context === 'transactions') {
          const mockTransactions = [
            { date: '2024-01-15', description: 'Grocery Store', amount: '-$45.67' },
            { date: '2024-01-14', description: 'Salary Deposit', amount: '+$1,200.00' },
            { date: '2024-01-10', description: 'Restaurant', amount: '-$32.40' }
          ];
          
          let transactionText = "Here are your recent transactions:\n\n";
          mockTransactions.forEach(t => {
            transactionText += `${t.date}: ${t.description} ${t.amount}\n`;
          });
          
          setMessages(prev => [...prev, { 
            type: 'bot', 
            text: transactionText,
            downloadOptions: true
          }]);
        } else if (context === 'accountStatement') {
          setMessages(prev => [...prev, { 
            type: 'bot', 
            text: "I've prepared your account statement. You can download it in your preferred format:",
            downloadOptions: true
          }]);
        }
      }
    }, 1000);
  };
  
  const handleDownload = (format) => {
    // Add user selection to chat
    setMessages([...messages, { 
      type: 'user', 
      text: `Download as ${format.toUpperCase()}`
    }]);
    
    // Simulate download process
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: `Your ${format.toUpperCase()} file is being prepared. It will be downloaded shortly.`
      }]);
      
      // In a real app, this would trigger the actual file download
      
      // Show main options again
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          text: "What else would you like to know?",
          options: [
            { label: "💸 Transactions", value: "transactions" },
            { label: "💳 Card Services", value: "cardServices" },
            { label: "🧾 Account Statement", value: "accountStatement" },
            { label: "👨‍💼 Talk to Agent", value: "talkToAgent" }
          ]
        }]);
      }, 1000);
    }, 1000);
  };
  
  // Helper function to get label for option
  const getOptionLabel = (option) => {
    switch(option) {
      case 'transactions': return '💸 Transactions';
      case 'cardServices': return '💳 Card Services';
      case 'accountStatement': return '🧾 Account Statement';
      case 'talkToAgent': return '👨‍💼 Talk to Agent';
      case 'contactSupport': return '📞 Contact Support';
      default: return option;
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-messages" ref={messagesRef}>
        {/* Display bot conversation history */}
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {msg.text}
            {msg.options && (
              <div className="bot-options">
                {msg.options.map((option, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleOption(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
            {msg.dateRange && (
              <div className="date-range-picker">
                <button onClick={() => handleDateRangeSelection(msg.context, "last7days")}>Last 7 Days</button>
                <button onClick={() => handleDateRangeSelection(msg.context, "thisMonth")}>This Month</button>
                <button onClick={() => handleDateRangeSelection(msg.context, "customRange")}>Custom Range</button>
              </div>
            )}
            {msg.downloadOptions && (
              <div className="download-options">
                <button onClick={() => handleDownload("pdf")}>
                  <FaFileDownload /> Download as PDF
                </button>
                <button onClick={() => handleDownload("excel")}>
                  <FaFileDownload /> Download as Excel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="chat-input">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your message here..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatBot; 