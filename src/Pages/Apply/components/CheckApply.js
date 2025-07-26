import React, { useState } from 'react';

const CheckApply = ({setModule}) => {
  // States for application flow
  const [activeStep, setActiveStep] = useState(0);
  const [showCheckTypes, setShowCheckTypes] = useState(true);
  const [selectedCheckType, setSelectedCheckType] = useState('');

  // State for application form
  const [formData, setFormData] = useState({
    accountNumber: '',
    fullName: '',
    email: '',
    mobile: '',
    checkType: '',
    numberOfLeaves: '',
    deliveryAddress: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    urgentDelivery: false
  });

  // State for application status
  const [applicationStatus, setApplicationStatus] = useState({
    submitted: false,
    applicationId: '',
    status: ''
  });

  // Checkbook types data
  const checkTypes = [
    {
      id: 'personal',
      title: 'Personal Checkbook',
      description: 'Standard checkbook for personal accounts',
      leaves: [25, 50],
      price: 100,
      features: ['Personalized name printing', 'Security features', 'Standard processing time', 'Basic design']
    },
    {
      id: 'premium',
      title: 'Premium Checkbook',
      description: 'Premium checkbook with enhanced security features',
      leaves: [25, 50, 100],
      price: 200,
      features: ['Enhanced security features', 'Premium paper quality', 'Duplicate copies', 'Designer background']
    },
    {
      id: 'business',
      title: 'Business Checkbook',
      description: 'Professional checkbook for business accounts',
      leaves: [50, 100],
      price: 300,
      features: ['Company name printing', 'Multiple signatories option', 'High security features', 'Professional design']
    }
  ];

  // Eligibility criteria
  const eligibilityCriteria = {
    'personal': {
      type: 'Personal Checkbook',
      criteria: [
        'Active savings/current account for at least 3 months',
        'Minimum balance maintenance',
        'Valid KYC documents',
        'No recent bounced checks'
      ]
    },
    'premium': {
      type: 'Premium Checkbook',
      criteria: [
        'Active account for at least 6 months',
        'Average quarterly balance of TZS  25,000',
        'Good transaction history',
        'No check bounces in last 6 months'
      ]
    },
    'business': {
      type: 'Business Checkbook',
      criteria: [
        'Active business account',
        'Minimum balance of TZS  50,000',
        'Valid business documentation',
        'Good banking relationship'
      ]
    }
  };

  // Handle starting the application process
  const handleApplyNow = (checkId) => {
    setShowCheckTypes(false);
    setSelectedCheckType(checkId);
    setActiveStep(1);
    setFormData({
      ...formData,
      checkType: checkId
    });
  };

  // Handle moving to next step
  const handleNextStep = () => {
    setActiveStep(activeStep + 1);
  };

  // Handle moving to previous step
  const handlePrevStep = () => {
    setActiveStep(activeStep - 1);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('deliveryAddress.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        deliveryAddress: {
          ...formData.deliveryAddress,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  function handleCancel() {
    setSelectedCheckType('');
    setShowCheckTypes(true);
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const applicationId = 'CHQ' + Math.floor(100000 + Math.random() * 900000);
    
    setApplicationStatus({
      submitted: true,
      applicationId: applicationId,
      status: 'Processing'
    });
    
    setActiveStep(3);
  };

  return (
    <div className="wallet-container wallet-section">
      <div className="wallet-card wallet-fade-in">
        <div className="wallet-card-header">
          <h5 className="mb-0">Checkbook Application</h5>
        </div>
        <div className="wallet-card-body">
          {/* Checkbook Types Section */}
          {showCheckTypes && (
            <div className="row mb-4">
              <div className="col-lg-12">
                <div className="section-title wallet-fade-in-delay-1">Types of Checkbooks</div>
                <div className="row">
                  {checkTypes.map(check => (
                    <div key={check.id} className="col-md-6 col-lg-4 mb-3">
                      <div className="feature-card" style={{height: '100%'}}>
                        <div className="feature-title">
                          <i className="fa-solid fa-book"></i> {check.title}
                        </div>
                        <div className="feature-description">
                          {check.description}
                        </div>
                        <div className="mt-2">
                          <div><strong>Price:</strong> TZS  {check.price}</div>
                          <div><strong>Available Leaves:</strong> {check.leaves.join(', ')}</div>
                        </div>
                        <ul className="mt-2" style={{paddingLeft: '20px', fontSize: '14px'}}>
                          {check.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                        <button 
                          className="action-button primary mt-2 w-100" 
                          onClick={() => handleApplyNow(check.id)}
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Application Flow Section */}
          {selectedCheckType && (
            <div id="application-flow" className="row mb-4">
              {/* Progress Bar and Steps */}
              <div className="col-lg-12">
                <div className="section-title wallet-fade-in-delay-1">
                  {checkTypes.find(c => c.id === selectedCheckType)?.title} Application
                </div>
                
                <div className="mt-3 mb-4">
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar bg-success" 
                      role="progressbar" 
                      style={{ width: `${activeStep * 33.33}%` }} 
                      aria-valuenow={activeStep * 33.33} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <small style={{color: activeStep >= 1 ? '#00a651' : '#757575'}}>Eligibility</small>
                    <small style={{color: activeStep >= 2 ? '#00a651' : '#757575'}}>Application Form</small>
                    <small style={{color: activeStep >= 3 ? '#00a651' : '#757575'}}>Status</small>
                  </div>
                </div>

                {/* Step 1: Eligibility */}
                {activeStep === 1 && (
                  <div className="credit-limit-section mb-3">
                    <div className="section-title">Eligibility Criteria</div>
                    <div className="card-status">
                      <span className="status-label">{eligibilityCriteria[selectedCheckType].type}:</span>
                    </div>
                    <ul style={{paddingLeft: '20px', marginTop: '10px'}}>
                      {eligibilityCriteria[selectedCheckType].criteria.map((criterion, idx) => (
                        <li key={idx} style={{marginBottom: '8px', fontSize: '14px'}}>{criterion}</li>
                      ))}
                    </ul>
                    <div className="d-flex justify-content-between mt-4">
                      <button className="action-button secondary" onClick={handleCancel}>
                        Cancel
                      </button>
                      <button className="action-button primary" onClick={handleNextStep}>
                        Next <i className="fa-solid fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Application Form */}
                {activeStep === 2 && (
                  <div className="credit-limit-section mb-3">
                    <div className="section-title">Application Form</div>
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        {/* Personal Details */}
                        <div className="col-lg-6">
                          <div className="card-information">
                            <div className="section-title">Account Details</div>
                            <div className="mb-3">
                              <label className="form-label">Account Number</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleInputChange}
                                required 
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Full Name</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                required 
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Number of Leaves</label>
                              <select 
                                className="form-select"
                                name="numberOfLeaves"
                                value={formData.numberOfLeaves}
                                onChange={handleInputChange}
                                required
                              >
                                <option value="">Select number of leaves</option>
                                {checkTypes.find(c => c.id === selectedCheckType)?.leaves.map(leaf => (
                                  <option key={leaf} value={leaf}>{leaf} leaves</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="col-lg-6">
                          <div className="card-information">
                            <div className="section-title">Delivery Address</div>
                            <div className="mb-3">
                              <label className="form-label">Street Address</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                name="deliveryAddress.street"
                                value={formData.deliveryAddress.street}
                                onChange={handleInputChange}
                                required 
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">City</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                name="deliveryAddress.city"
                                value={formData.deliveryAddress.city}
                                onChange={handleInputChange}
                                required 
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">State</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                name="deliveryAddress.state"
                                value={formData.deliveryAddress.state}
                                onChange={handleInputChange}
                                required 
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">PIN Code</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                name="deliveryAddress.pincode"
                                value={formData.deliveryAddress.pincode}
                                onChange={handleInputChange}
                                required 
                              />
                            </div>
                          </div>
                        </div>

                        {/* Delivery Options */}
                        <div className="col-lg-12 mt-3">
                          <div className="mb-3 form-check">
                            <input 
                              type="checkbox" 
                              className="form-check-input" 
                              id="urgentDelivery"
                              name="urgentDelivery"
                              checked={formData.urgentDelivery}
                              onChange={(e) => handleInputChange({
                                target: {
                                  name: 'urgentDelivery',
                                  value: e.target.checked
                                }
                              })}
                            />
                            <label className="form-check-label" htmlFor="urgentDelivery">
                              Opt for urgent delivery (Additional charges apply)
                            </label>
                          </div>
                          <div className="mb-3 form-check">
                            <input type="checkbox" className="form-check-input" id="termsCheck" required />
                            <label className="form-check-label" htmlFor="termsCheck">
                              I agree to the Terms & Conditions
                            </label>
                          </div>
                          <div className="d-flex justify-content-between mt-4">
                            <button type="button" className="action-button secondary" onClick={handlePrevStep}>
                              <i className="fa-solid fa-arrow-left"></i> Back
                            </button>
                            <button type="submit" className="action-button primary">
                              Submit Application <i className="fa-solid fa-paper-plane"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* Step 3: Application Status */}
                {activeStep === 3 && (
                  <div className="credit-limit-section mb-3">
                    <div className="section-title">Application Status</div>
                    {applicationStatus.submitted ? (
                      <div>
                        <div className="card-status mb-3">
                          <span className="status-label">Application ID:</span>
                          <span className="status-value status-active">
                            {applicationStatus.applicationId}
                          </span>
                        </div>
                        <div className="card-status mb-3">
                          <span className="status-label">Status:</span>
                          <span className="status-value status-active">
                            {applicationStatus.status}
                          </span>
                        </div>
                        
                        <div className="mt-3">
                          <div className="progress" style={{ height: '8px' }}>
                            <div 
                              className="progress-bar bg-success" 
                              role="progressbar" 
                              style={{ width: '25%' }} 
                              aria-valuenow="25" 
                              aria-valuemin="0" 
                              aria-valuemax="100"
                            ></div>
                          </div>
                          <div className="d-flex justify-content-between mt-2">
                          <small>Application Received</small>
                            <small>Document Verification</small>
                            <small>Processing & Printing</small>
                            <small>Delivery</small>
                          </div>
                        </div>
                        
                        <div className="upcoming-payment mt-3">
                          <div className="payment-details">
                            <div className="payment-date">Expected Delivery By:</div>
                            <div className="payment-description">
                              {new Date(Date.now() + (formData.urgentDelivery ? 2 : 7) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="d-flex justify-content-between">
                              <button className="action-button secondary" onClick={() => {
                                setSelectedCheckType('');
                                setShowCheckTypes(true);
                                setActiveStep(0);
                                setFormData({
                                  accountNumber: '',
                                  fullName: '',
                                  email: '',
                                  mobile: '',
                                  checkType: '',
                                  numberOfLeaves: '',
                                  deliveryAddress: {
                                    street: '',
                                    city: '',
                                    state: '',
                                    pincode: ''
                                  }
                                })
                              }}>
                                New Application
                              </button>
                              <button className="action-button primary">
                                <i className="fa-solid fa-print"></i> Print Receipt
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="empty-state">
                        <i className="fa-solid fa-book"></i>
                        <p>Application not submitted yet</p>
                        <small>Please complete the application form</small>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckApply;