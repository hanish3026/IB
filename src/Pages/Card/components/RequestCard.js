import React, { useState } from 'react';

const RequestCard = ({ setModule }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [showCardTypes, setShowCardTypes] = useState(true);
  const [selectedCardType, setSelectedCardType] = useState('');

  // State for application form
  const [formData, setFormData] = useState({
    accountNumber: '',
    fullName: '',
    email: '',
    mobile: '',
    cardType: '',
    cardVariant: '',
    deliveryAddress: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    income: '',
    occupation: '',
    existingCard: false
  });

  // State for application status
  const [applicationStatus, setApplicationStatus] = useState({
    submitted: false,
    applicationId: '',
    status: ''
  });

  // Card types data
  const cardTypes = [
    {
      id: 'debit',
      title: 'Debit Card',
      description: 'Access your account anytime, anywhere',
      variants: [
        {
          id: 'classic',
          name: 'Classic Debit Card',
          limit: '40,000 daily',
          annual: 300,
          features: [
            'Contactless payments',
            'Online shopping enabled',
            'ATM withdrawals',
            'Basic insurance coverage'
          ]
        },
        {
          id: 'platinum',
          name: 'Platinum Debit Card',
          limit: '1,00,000 daily',
          annual: 1000,
          features: [
            'Higher withdrawal limits',
            'Airport lounge access',
            'Enhanced insurance coverage',
            'Exclusive rewards program'
          ]
        }
      ]
    },
    {
      id: 'credit',
      title: 'Credit Card',
      description: 'Enjoy exclusive benefits and rewards',
      variants: [
        {
          id: 'rewards',
          name: 'Rewards Credit Card',
          limit: '50,000',
          annual: 500,
          features: [
            'Reward points on purchases',
            'Fuel surcharge waiver',
            'Movie ticket discounts',
            'EMI conversion facility'
          ]
        },
        {
          id: 'premium',
          name: 'Premium Credit Card',
          limit: '2,00,000',
          annual: 2000,
          features: [
            'Premium rewards program',
            'Complimentary lounge access',
            'Golf course privileges',
            'Concierge services'
          ]
        }
      ]
    }
  ];

  // Eligibility criteria
  const eligibilityCriteria = {
    'debit': {
      type: 'Debit Card',
      criteria: [
        'Active savings/current account',
        'Valid KYC documents',
        'Minimum balance maintenance',
        'Valid mobile number & email'
      ]
    },
    'credit': {
      type: 'Credit Card',
      criteria: [
        'Age: 21-60 years',
        'Minimum annual income: TZS  3,00,000',
        'Good credit score (700+)',
        'Stable employment/business'
      ]
    }
  };

  // Handle starting the application process
  const handleApplyNow = (cardId) => {
    setShowCardTypes(false);
    setSelectedCardType(cardId);
    setActiveStep(1);
    setFormData({
      ...formData,
      cardType: cardId
    });
  };

  // Handle moving between steps
  const handleNextStep = () => setActiveStep(activeStep + 1);
  const handlePrevStep = () => setActiveStep(activeStep - 1);
  const handleCancel = () => {
    setSelectedCardType('');
    setShowCardTypes(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('deliveryAddress.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        deliveryAddress: {
          ...formData.deliveryAddress,
          [field]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const applicationId = 'CARD' + Math.floor(100000 + Math.random() * 900000);

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
          <h5 className="mb-0">Card Application</h5>
        </div>
        <div className="wallet-card-body">
          {/* Card Types Section */}
          {showCardTypes && (
            <div className="row mb-4">
              <div className="col-lg-12">
                <div className="section-title wallet-fade-in-delay-1">Types of Cards</div>
                <div className="row">
                  {cardTypes.map(card => (
                    <div key={card.id} className="col-12 mb-4">
                      <div className="section-title">{card.title}</div>
                      <div className="row">
                        {card.variants.map(variant => (
                          <div key={variant.id} className="col-md-6 mb-3">
                            <div className="feature-card" style={{ height: '100%' }}>
                              <div className="feature-title">
                                <i className="fa-solid fa-credit-card"></i> {variant.name}
                              </div>
                              <div className="mt-2">
                                <div><strong>Limit:</strong> TZS  {variant.limit}</div>
                                <div><strong>Annual Fee:</strong> TZS  {variant.annual}</div>
                              </div>
                              <ul className="mt-2" style={{ paddingLeft: '20px', fontSize: '14px' }}>
                                {variant.features.map((feature, index) => (
                                  <li key={index}>{feature}</li>
                                ))}
                              </ul>
                              <button
                                className="action-button primary mt-2 w-100"
                                onClick={() => handleApplyNow(card.id)}
                              >
                                Apply Now
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Application Flow Section */}
          {selectedCardType && (
            <div id="application-flow" className="row mb-4">
              <div className="col-lg-12">
                <div className="section-title wallet-fade-in-delay-1">
                  {cardTypes.find(c => c.id === selectedCardType)?.title} Application
                </div>

                {/* Progress Bar */}
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
                    <small style={{ color: activeStep >= 1 ? '#00a651' : '#757575' }}>Eligibility</small>
                    <small style={{ color: activeStep >= 2 ? '#00a651' : '#757575' }}>Application Form</small>
                    <small style={{ color: activeStep >= 3 ? '#00a651' : '#757575' }}>Status</small>
                  </div>
                </div>

                {/* Step 1: Eligibility */}
                {activeStep === 1 && (
                  <div className="credit-limit-section mb-3">
                    <div className="section-title">Eligibility Criteria</div>
                    <div className="card-status">
                      <span className="status-label">{eligibilityCriteria[selectedCardType].type}:</span>
                    </div>
                    <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                      {eligibilityCriteria[selectedCardType].criteria.map((criterion, idx) => (
                        <li key={idx} style={{ marginBottom: '8px', fontSize: '14px' }}>{criterion}</li>
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
                            <div className="section-title">Personal Details</div>
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
                              <label className="form-label">Email</label>
                              <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Mobile Number</label>
                              <input
                                type="tel"
                                className="form-control"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Card Details */}
                        <div className="col-lg-6">
                          <div className="card-information">
                            <div className="section-title">Card Details</div>
                            <div className="mb-3">
                              <label className="form-label">Card Variant</label>
                              <select
                                className="form-select"
                                name="cardVariant"
                                value={formData.cardVariant}
                                onChange={handleInputChange}
                                required
                              >
                                <option value="">Select card variant</option>
                                {cardTypes.find(c => c.id === selectedCardType)?.variants.map(variant => (
                                  <option key={variant.id} value={variant.id}>
                                    {variant.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            {selectedCardType === 'credit' && (
                              <>
                                <div className="mb-3">
                                  <label className="form-label">Annual Income</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    name="income"
                                    value={formData.income}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                                <div className="mb-3">
                                  <label className="form-label">Occupation</label>
                                  <select
                                    className="form-select"
                                    name="occupation"
                                    value={formData.occupation}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    <option value="">Select occupation</option>
                                    <option value="salaried">Salaried</option>
                                    <option value="self-employed">Self Employed</option>
                                    <option value="business">Business Owner</option>
                                    <option value="professional">Professional</option>
                                  </select>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="col-lg-12 mt-3">
                          <div className="card-information">
                            <div className="section-title">Delivery Address</div>
                            <div className="row">
                              <div className="col-md-6">
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
                              </div>
                              <div className="col-md-6">
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
                              </div>
                              <div className="col-md-6">
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
                              </div>
                              <div className="col-md-6">
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
                          </div>

                          <div className="mb-3 form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="existingCard"
                              name="existingCard"
                              checked={formData.existingCard}
                              onChange={(e) => handleInputChange({
                                target: {
                                  name: 'existingCard',
                                  value: e.target.checked
                                }
                              })}
                            />
                            <label className="form-check-label" htmlFor="existingCard">
                              I have an existing card with this bank
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
                            <small>Card Processing</small>
                            <small>Card Delivery</small>
                          </div>
                        </div>

                        <div className="upcoming-payment mt-3">
                          <div className="payment-details">
                            <div className="payment-date">Expected Delivery By:</div>
                            <div className="payment-description">
                              {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="d-flex justify-content-between">
                              <button className="action-button secondary" onClick={() => {
                                setSelectedCardType('');
                                setShowCardTypes(true);
                                setActiveStep(0);
                                setFormData({  accountNumber: '',
                                  fullName: '',
                                  email: '',
                                  mobile: '',
                                  cardType: '',
                                  cardVariant: '',
                                  deliveryAddress: {
                                    street: '',
                                    city: '',
                                    state: '',
                                    pincode: ''
                                  },
                                  income: '',
                                  occupation: '',
                                  existingCard: false
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
                        <i className="fa-solid fa-credit-card"></i>
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

export default RequestCard;