import React, { useState } from 'react';
import '../css/CheckStatus.css';

const CheckStatus = () => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for applications - in real app, this would come from API
  const applications = [
    {
      id: 'APP123456',
      type: 'Account Opening',
      accountType: 'Savings Account',
      status: 'processing',
      appliedDate: '2024-01-15',
      lastUpdated: '2024-01-18',
      expectedCompletion: '2024-01-25',
      currentStep: 2,
      totalSteps: 4,
      steps: [
        { name: 'Application Received', completed: true, date: '2024-01-15' },
        { name: 'Document Verification', completed: true, date: '2024-01-17' },
        { name: 'Account Processing', completed: false, date: null },
        { name: 'Account Activation', completed: false, date: null }
      ],
      details: {
        applicantName: 'John Doe',
        email: 'john.doe@email.com',
        mobile: '+255 123 456 789',
        initialDeposit: '10,000'
      }
    },
    {
      id: 'CHQ789012',
      type: 'Checkbook Request',
      checkType: 'Premium Checkbook',
      status: 'completed',
      appliedDate: '2024-01-10',
      lastUpdated: '2024-01-20',
      expectedCompletion: '2024-01-17',
      currentStep: 4,
      totalSteps: 4,
      steps: [
        { name: 'Application Received', completed: true, date: '2024-01-10' },
        { name: 'Document Verification', completed: true, date: '2024-01-12' },
        { name: 'Processing & Printing', completed: true, date: '2024-01-15' },
        { name: 'Delivery', completed: true, date: '2024-01-17' }
      ],
      details: {
        applicantName: 'Jane Smith',
        email: 'jane.smith@email.com',
        mobile: '+255 987 654 321',
        numberOfLeaves: '50',
        deliveryAddress: 'Dar es Salaam, Tanzania'
      }
    },
    {
      id: 'DEP345678',
      type: 'Fixed Deposit',
      depositType: 'Fixed Deposit',
      status: 'declined',
      appliedDate: '2024-01-12',
      lastUpdated: '2024-01-16',
      expectedCompletion: '2024-01-19',
      currentStep: 2,
      totalSteps: 4,
      steps: [
        { name: 'Application Received', completed: true, date: '2024-01-12' },
        { name: 'Document Verification', completed: true, date: '2024-01-14' },
        { name: 'Credit Assessment', completed: false, date: null },
        { name: 'Account Opening', completed: false, date: null }
      ],
      details: {
        applicantName: 'Mike Johnson',
        email: 'mike.johnson@email.com',
        mobile: '+255 555 123 456',
        depositAmount: '50,000',
        tenure: '12 months'
      },
      declineReason: 'Insufficient documentation provided. Please resubmit with complete KYC documents.'
    },
    {
      id: 'LOAN901234',
      type: 'Loan Application',
      loanType: 'Personal Loan',
      status: 'processing',
      appliedDate: '2024-01-20',
      lastUpdated: '2024-01-22',
      expectedCompletion: '2024-02-05',
      currentStep: 1,
      totalSteps: 5,
      steps: [
        { name: 'Application Received', completed: true, date: '2024-01-20' },
        { name: 'Document Verification', completed: false, date: null },
        { name: 'Credit Assessment', completed: false, date: null },
        { name: 'Approval Process', completed: false, date: null },
        { name: 'Loan Disbursement', completed: false, date: null }
      ],
      details: {
        applicantName: 'Sarah Wilson',
        email: 'sarah.wilson@email.com',
        mobile: '+255 777 888 999',
        loanAmount: '500,000',
        purpose: 'Business Expansion'
      }
    },
    {
      id: 'CARD567890',
      type: 'Credit Card',
      cardType: 'Premium Credit Card',
      status: 'completed',
      appliedDate: '2024-01-05',
      lastUpdated: '2024-01-15',
      expectedCompletion: '2024-01-15',
      currentStep: 4,
      totalSteps: 4,
      steps: [
        { name: 'Application Received', completed: true, date: '2024-01-05' },
        { name: 'Credit Verification', completed: true, date: '2024-01-08' },
        { name: 'Card Processing', completed: true, date: '2024-01-12' },
        { name: 'Card Delivery', completed: true, date: '2024-01-15' }
      ],
      details: {
        applicantName: 'David Brown',
        email: 'david.brown@email.com',
        mobile: '+255 444 333 222',
        creditLimit: '100,000',
        cardType: 'Premium'
      }
    }
  ];

  // Filter applications based on search term
  const filteredApplications = applications.filter(app => 
    app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.details.applicantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status color and icon
  const getStatusStyle = (status) => {
    switch (status) {
      case 'processing':
        return { 
          color: '#ff9800', 
          backgroundColor: '#fff3e0', 
          icon: 'fa-clock',
          text: 'Processing'
        };
      case 'completed':
        return { 
          color: '#4caf50', 
          backgroundColor: '#e8f5e8', 
          icon: 'fa-check-circle',
          text: 'Completed'
        };
      case 'declined':
        return { 
          color: '#f44336', 
          backgroundColor: '#ffebee', 
          icon: 'fa-times-circle',
          text: 'Declined'
        };
      default:
        return { 
          color: '#757575', 
          backgroundColor: '#f5f5f5', 
          icon: 'fa-question-circle',
          text: 'Unknown'
        };
    }
  };

  // Handle application click
  const handleApplicationClick = (application) => {
    setSelectedApplication(application);
  };

  // Handle back to list
  const handleBackToList = () => {
    setSelectedApplication(null);
  };

  // Calculate progress percentage
  const getProgressPercentage = (currentStep, totalSteps) => {
    return (currentStep / totalSteps) * 100;
  };

  return (
    <div className="application-status-container">
      <div className="application-status-card application-status-fade-in">
        <div className="application-status-card-header">
          <h5 className="mb-0">
            {selectedApplication ? (
              <div className="d-flex align-items-center">
                <button 
                  className="application-status-back-button"
                  onClick={handleBackToList}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                Application Details - {selectedApplication.id}
              </div>
            ) : (
              'Check Application Status'
            )}
          </h5>
        </div>
        <div className="application-status-card-body">
          {!selectedApplication ? (
            <>
              {/* Search Bar */}
              <div className="mb-4">
                <div className="application-status-search-container">
                  <i className="fa-solid fa-search"></i>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Application ID, Type, or Name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Applications List */}
              <div className="application-status-section-title application-status-fade-in-delay-1">Your Applications</div>
              
              {filteredApplications.length === 0 ? (
                <div className="application-status-empty-state">
                  <i className="fa-solid fa-search"></i>
                  <p>No applications found</p>
                  <small>Try adjusting your search criteria</small>
                </div>
              ) : (
                <div className="row">
                  {filteredApplications.map(application => {
                    const statusStyle = getStatusStyle(application.status);
                    return (
                      <div key={application.id} className="col-md-6 col-lg-4 mb-3">
                        <div 
                          className="application-status-feature-card cursor-pointer h-100"
                          onClick={() => handleApplicationClick(application)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div className="application-status-feature-title">
                              <i className="fa-solid fa-file-alt"></i> {application.type}
                            </div>
                            <span 
                              className="application-status-badge"
                              style={{
                                color: statusStyle.color,
                                backgroundColor: statusStyle.backgroundColor,
                                border: `1px solid ${statusStyle.color}`
                              }}
                            >
                              <i className={`fa-solid ${statusStyle.icon} me-1`}></i>
                              {statusStyle.text}
                            </span>
                          </div>
                          
                          <div className="application-status-feature-description mb-2">
                            <strong>ID:</strong> {application.id}
                          </div>
                          
                          <div className="mb-2" style={{ fontSize: '14px', color: '#666' }}>
                            <div><strong>Type:</strong> {application.accountType || application.checkType || application.depositType || application.loanType || application.cardType}</div>
                            <div><strong>Applied:</strong> {new Date(application.appliedDate).toLocaleDateString()}</div>
                            <div><strong>Applicant:</strong> {application.details.applicantName}</div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-2">
                            <div className="application-status-progress">
                              <div 
                                className={`application-status-progress-bar ${application.status === 'completed' ? 'bg-success' : application.status === 'declined' ? 'bg-danger' : 'bg-warning'}`}
                                role="progressbar" 
                                style={{ width: `${getProgressPercentage(application.currentStep, application.totalSteps)}%` }} 
                                aria-valuenow={getProgressPercentage(application.currentStep, application.totalSteps)} 
                                aria-valuemin="0" 
                                aria-valuemax="100"
                              ></div>
                            </div>
                            <small className="text-muted">
                              Step {application.currentStep} of {application.totalSteps}
                            </small>
                          </div>
                          
                          <div className="mt-2">
                            <small style={{ color: statusStyle.color }}>
                              Click to view details
                            </small>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            /* Detailed Status View */
            <div className="application-status-details-section mb-3">
              <div className="application-status-section-title">Application Status Details</div>
              
              {/* Application Info */}
              <div className="application-status-info-grid">
                <div className="application-status-info-item">
                  <span className="application-status-info-label">Application ID:</span>
                  <span className="application-status-info-value status-active">
                    {selectedApplication.id}
                  </span>
                </div>
                <div className="application-status-info-item">
                  <span className="application-status-info-label">Application Type:</span>
                  <span className="application-status-info-value">
                    {selectedApplication.type}
                  </span>
                </div>
                <div className="application-status-info-item">
                  <span className="application-status-info-label">Status:</span>
                  <span 
                    className="application-status-info-value"
                    style={{ color: getStatusStyle(selectedApplication.status).color }}
                  >
                    <i className={`fa-solid ${getStatusStyle(selectedApplication.status).icon} me-1`}></i>
                    {getStatusStyle(selectedApplication.status).text}
                  </span>
                </div>
                <div className="application-status-info-item">
                  <span className="application-status-info-label">Applied Date:</span>
                  <span className="application-status-info-value">
                    {new Date(selectedApplication.appliedDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="application-status-info-item">
                  <span className="application-status-info-label">Last Updated:</span>
                  <span className="application-status-info-value">
                    {new Date(selectedApplication.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
                <div className="application-status-info-item">
                  <span className="application-status-info-label">Expected Completion:</span>
                  <span className="application-status-info-value">
                    {new Date(selectedApplication.expectedCompletion).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Progress Tracking */}
              <div className="mt-3">
                <div className="application-status-progress" style={{ height: '8px' }}>
                  <div 
                    className={`application-status-progress-bar ${selectedApplication.status === 'completed' ? 'bg-success' : selectedApplication.status === 'declined' ? 'bg-danger' : 'bg-warning'}`}
                    role="progressbar" 
                    style={{ width: `${getProgressPercentage(selectedApplication.currentStep, selectedApplication.totalSteps)}%` }} 
                    aria-valuenow={getProgressPercentage(selectedApplication.currentStep, selectedApplication.totalSteps)} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  ></div>
                </div>
                <div className="application-status-step-indicators">
                  {selectedApplication.steps.map((step, index) => (
                    <small 
                      key={index}
                      className={`application-status-step-text ${step.completed ? 'completed' : selectedApplication.status === 'declined' && index >= selectedApplication.currentStep ? 'declined' : 'pending'}`}
                    >
                      {step.name}
                    </small>
                  ))}
                </div>
              </div>

              {/* Detailed Steps */}
              <div className="application-status-timeline">
                <h6>Process Timeline</h6>
                <div>
                  {selectedApplication.steps.map((step, index) => (
                    <div key={index} className="application-status-timeline-item">
                      <div className="d-flex align-items-center">
                        <div 
                          className={`application-status-timeline-marker ${step.completed ? 'completed' : selectedApplication.status === 'declined' && index >= selectedApplication.currentStep ? 'declined' : ''}`}
                        ></div>
                        <div className="application-status-timeline-content">
                          <div className="d-flex justify-content-between align-items-center">
                            <span 
                              className={`application-status-timeline-title ${step.completed ? 'completed' : selectedApplication.status === 'declined' && index >= selectedApplication.currentStep ? 'declined' : ''}`}
                            >
                              {step.name}
                            </span>
                            {step.date && (
                              <small className="application-status-timeline-date">
                                {new Date(step.date).toLocaleDateString()}
                              </small>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decline Reason */}
              {selectedApplication.status === 'declined' && selectedApplication.declineReason && (
                <div className="mt-4">
                  <div className="application-status-alert alert-danger">
                    <h6><i className="fa-solid fa-exclamation-triangle me-2"></i>Decline Reason</h6>
                    <p className="mb-0">{selectedApplication.declineReason}</p>
                  </div>
                </div>
              )}

              {/* Application Details */}
              <div className="mt-4">
                <h6>Application Details</h6>
                <div className="application-status-details-grid">
                  <div className="application-status-details-card">
                    <div className="application-status-details-item"><strong>Applicant Name:</strong> {selectedApplication.details.applicantName}</div>
                    <div className="application-status-details-item"><strong>Email:</strong> {selectedApplication.details.email}</div>
                    <div className="application-status-details-item"><strong>Mobile:</strong> {selectedApplication.details.mobile}</div>
                  </div>
                  <div className="application-status-details-card">
                    {Object.entries(selectedApplication.details)
                      .filter(([key]) => !['applicantName', 'email', 'mobile'].includes(key))
                      .map(([key, value]) => (
                        <div key={key} className="application-status-details-item">
                          <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {value}
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="application-status-action-buttons">
                <button className="application-status-btn application-status-btn-secondary" onClick={handleBackToList}>
                  <i className="fa-solid fa-arrow-left"></i> Back to Applications
                </button>
                <div>
                  <button className="application-status-btn application-status-btn-secondary me-2">
                    <i className="fa-solid fa-print"></i> Print Details
                  </button>
                  <button className="application-status-btn application-status-btn-primary">
                    <i className="fa-solid fa-refresh"></i> Refresh Status
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckStatus;