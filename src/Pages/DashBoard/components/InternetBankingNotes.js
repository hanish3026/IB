import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/InternetBankingNotes.css";

const InternetBankingNotes = () => {
  const [expandedNote, setExpandedNote] = useState(null);

  const noteCategories = [
    {
      title: "Basics",
      notes: [
        "Internet banking, also known as online banking or e-banking, is a digital service provided by banks that allows customers to access, manage, and perform financial transactions on their bank accounts via the internet. It eliminates the need to visit a physical bank branch and enables users to conduct banking operations anytime and anywhere using a computer, smartphone, or tablet.",
        "Internet banking offers round-the-clock access to financial services, allowing users to perform various banking operations at any time—day or night, weekends, and even on holidays—without needing to visit a physical branch. This enhances convenience and flexibility for customers who may have busy schedules or limited access to traditional banking hours.",
        "Internet banking allows users to check account balances, view statements, and track transactions in real time, providing instant access to their financial data without visiting a branch. This feature enhances financial management, transparency, and security for users."
      ]
    },
    {
      title: "Financial Services",
      notes: [
        "Investment options include Fixed Deposits (FDs), Recurring Deposits (RDs), mutual funds, and stock trading.",
        "Bill payments allow you to pay utilities, credit cards, and subscriptions automatically or manually.",
        "Fund transfers enable sending money to other accounts through NEFT, RTGS, IMPS, or UPI."
      ]
    },
    {
      title: "Account Management",
      notes: [
        "Allows users to request, block, or manage debit/credit cards without visiting a branch.",
        "E-statements reduce paper usage and provide downloadable statements in PDF or Excel formats.",
        "Automated alerts can be set up for large transactions, low balances, or suspicious activities."
      ]
    },
    {
      title: "Security Tips",
      notes: [
        "Use strong, unique passwords and change them regularly.",
        "Never access your bank account on public Wi-Fi networks.",
        "Enable two-factor authentication for an extra layer of security.",
        "Verify the website's security by checking for 'https://' and a padlock icon."
      ]
    }
  ];

  const toggleNote = (categoryIndex, noteIndex) => {
    const key = `${categoryIndex}-${noteIndex}`;
    setExpandedNote(expandedNote === key ? null : key);
  };

  return (
    <div className="container internet-banking-container">
      {/* <div className="banking-card p-4 mb-4">
        <h2 className="banking-title mb-3">Internet Banking Guide</h2>
        <p className="banking-subtitle">Essential information to make the most of your online banking experience</p>
      </div> */}

      {noteCategories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="banking-card p-4 mb-3">
          <h3 className="category-title mb-3">{category.title}</h3>
          <ul className="notes-list">
            {category.notes.map((note, noteIndex) => {
              const isExpanded = expandedNote === `${categoryIndex}-${noteIndex}`;
              const key = `${categoryIndex}-${noteIndex}`;
              console.log(key)
              return (
                <li 
                  key={noteIndex} 
                  className={`note-item ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => toggleNote(categoryIndex, noteIndex)}
                >
                  <div className="note-content">
                    <span className="note-icon">•</span>
                    <span className="note-text">
                      {isExpanded ? note : note.length > 150 ? `${note.substring(0, 150)}...` : note}
                    </span>
                    {note.length > 150 && (
                      <button className="expand-button">
                        {isExpanded ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div className="banking-card p-4">
        <h3 className="category-title mb-3">Need Help?</h3>
        <p className="help-text">Contact our customer support team 24/7 at <strong>1-800-BANKING</strong> or email us at <strong>support@bankname.com</strong></p>
      </div>
    </div>
  );
};

export default InternetBankingNotes;