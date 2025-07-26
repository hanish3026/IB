import React, { useState } from "react";
import "../css/BankingFAQ.css";

const BankingFAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeId, setActiveId] = useState(null);

  const faqData = [
    {
      id: "faq1",
      question: "How do I register for Internet Banking?",
      answer: "To register, visit your bank's official website, navigate to the **Internet Banking** section, and follow the instructions to sign up using your account details."
    },
    {
      id: "faq2",
      question: "What should I do if I forget my Internet Banking password?",
      answer: "Click on **Forgot Password** on the login page, follow the verification steps, and reset your password using your registered mobile number or email."
    },
    {
      id: "faq3",
      question: "How can I transfer money using Internet Banking?",
      answer: "Log in to your Internet Banking account, navigate to the **Fund Transfer** section, select the transfer type (NEFT, IMPS, RTGS), enter recipient details, and confirm the transaction."
    },
    {
      id: "faq4",
      question: "Is Internet Banking safe?",
      answer: "Yes, if you follow best practices like **using strong passwords, enabling two-factor authentication, avoiding public Wi-Fi**, and never sharing your login credentials."
    },
    {
      id: "faq5",
      question: "Can I open a Fixed Deposit (FD) online?",
      answer: "Yes, most banks allow you to open an **FD online** through Internet Banking. Simply log in, select the **Open FD** option, choose tenure and amount, and confirm the request."
    },
    {
      id: "faq6",
      question: "How can I check my account balance online?",
      answer: "Log in to Internet Banking, go to the **Account Summary** section, and view your available balance. You can also check via your bank's mobile app."
    },
    {
      id: "faq7",
      question: "What is the daily transaction limit in Internet Banking?",
      answer: "The limit depends on your bank and the type of transfer (NEFT, IMPS, RTGS). You can check and modify it under the **Transaction Limit Settings** in your account."
    },
    {
      id: "faq8",
      question: "How do I update my mobile number in Internet Banking?",
      answer: "You can update your registered mobile number by visiting the **Profile Settings** section in Internet Banking or by visiting your nearest bank branch with valid ID proof."
    },
    {
      id: "faq9",
      question: "How do I set up recurring payments?",
      answer: "Access the **Bill Pay** or **Standing Instructions** section, select the recurring payment option, enter the payee details, set your payment frequency, and confirm the setup."
    },
    {
      id: "faq10",
      question: "How can I report suspicious transactions?",
      answer: "Contact your bank's **24/7 helpline** immediately, visit the nearest branch, or use the **Report Fraud** option available in your Internet Banking portal. Never delay reporting suspicious activity."
    }
  ];

  const toggleAccordion = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  const renderBoldText = (text) => {
    return text.split(/(\*\*.*?\*\*)/).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const filteredFAQs = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="faq-container">
      {/* <h1 className="faq-title">Internet Banking FAQ</h1> */}
      
      {/* <div className="search-container">
        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div> */}

      {filteredFAQs.length === 0 ? (
        <div className="no-results">
          <p>No FAQs match your search. Try different keywords or <button onClick={() => setSearchTerm("")} className="reset-link">reset search</button>.</p>
        </div>
      ) : (
        <div className="accordion" id="faqAccordion">
          {filteredFAQs.map((faq) => (
            <div className="accordion-item" key={faq.id}>
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${activeId === faq.id ? "" : "collapsed"}`}
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                >
                  <span className="Qn">{faq.question}</span>
                </button>
              </h2>
              <div 
                className={`accordion-collapse ${activeId === faq.id ? "show" : "collapse"}`}
                id={faq.id}
              >
                <div className="accordion-body card-body-style">
                  {renderBoldText(faq.answer)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* <div className="contact-help">
        <p>Still have questions? <a href="#contact">Contact our support team</a></p>
      </div> */}
    </div>
  );
};

export default BankingFAQ;