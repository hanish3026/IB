import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import BillPaySuccess from '../../BillPay/components/BillPaySuccess';

const TransferWithOTP = ({ 
  show, 
  onHide, 
  transferDetails, 
  onConfirm, 
  onCancel,
  transferType 
}) => {
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('confirm'); // 'confirm', 'otp', 'success'
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Basic OTP validation
    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call for OTP verification
    setTimeout(() => {
      setIsProcessing(false);
      // For demo purposes, any 6-digit OTP is considered valid
      setStep('success');
      // In a real app, you would call onConfirm(otp) here
    }, 1500);
  };

  const handleConfirm = () => {
    setStep('otp');
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('confirm');
    } else if (step === 'success') {
      onHide();
    }
  };

  const renderConfirmation = () => (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Transfer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <h6 className="text-muted mb-3">Transfer Details</h6>
          <Row className="mb-2">
            <Col xs={5} className="text-muted">From Account:</Col>
            <Col xs={7} className="fw-medium">
              {transferDetails.fromAccount}
            </Col>
          </Row>
          <Row className="mb-2">
            <Col xs={5} className="text-muted">
              {transferType === 'own' ? 'To Account:' : 'Beneficiary:'}
            </Col>
            <Col xs={7} className="fw-medium">
              {transferDetails.toAccount}
            </Col>
          </Row>
          {transferType !== 'own' && (
            <Row className="mb-2">
              <Col xs={5} className="text-muted">Account Number:</Col>
              <Col xs={7} className="fw-medium">
                {transferDetails.accountNumber}
              </Col>
            </Row>
          )}
          {transferType === 'neft' && (
            <Row className="mb-2">
              <Col xs={5} className="text-muted">Bank Name:</Col>
              <Col xs={7} className="fw-medium">
                {transferDetails.bankName}
              </Col>
            </Row>
          )}
          <Row className="mb-2">
            <Col xs={5} className="text-muted">Amount:</Col>
            <Col xs={7} className="fw-medium text-primary">
              TZS {parseFloat(transferDetails.amount).toLocaleString()}
            </Col>
          </Row>
          {transferDetails.remarks && (
            <Row className="mb-2">
              <Col xs={5} className="text-muted">Remarks:</Col>
              <Col xs={7} className="fw-medium">
                {transferDetails.remarks}
              </Col>
            </Row>
          )}
        </div>
        <Alert variant="warning" className="small">
          <FaInfoCircle className="me-2" />
          Please verify all details before confirming. This action cannot be undone.
        </Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirm Transfer
        </Button>
      </Modal.Footer>
    </>
  );

  const renderOTP = () => (
    <>
      <Modal.Header>
        <Button 
          variant="link" 
          onClick={handleBack}
          className="p-0 me-2"
        >
          <FaArrowLeft />
        </Button>
        <Modal.Title>Enter OTP</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted mb-4">
          We've sent a 6-digit OTP to your registered mobile number ending with <strong>**34</strong>.
          Please enter it below to complete the transfer.
        </p>
        
        <Form onSubmit={handleOtpSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>Enter OTP</Form.Label>
            <Form.Control
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="text-center fw-bold fs-4 letter-spacing"
              style={{ letterSpacing: '0.5em' }}
            />
            {error && <div className="text-danger small mt-1">{error}</div>}
            <div className="text-end mt-2">
              <Button variant="link" size="sm" className="p-0">
                Resend OTP
              </Button>
            </div>
          </Form.Group>
          
          <Button 
            variant="primary" 
            type="submit" 
            className="w-100"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Verifying...
              </>
            ) : 'Verify & Transfer'}
          </Button>
        </Form>
      </Modal.Body>
    </>
  );

  const renderSuccess = () => (
    <BillPaySuccess
      category="Transfer"
      provider={{
        name: transferDetails.toAccount,
        reference: `TRX${Math.floor(100000 + Math.random() * 900000)}`
      }}
      paymentDetails={{
        amount: transferDetails.amount,
        date: new Date().toLocaleString(),
        reference: `TRX${Math.floor(100000 + Math.random() * 900000)}`
      }}
      onStartNew={() => {
        onHide();
        onCancel();
      }}
    />
  );

  return (
    <Modal 
      show={show} 
      onHide={onHide}
      size={step === 'success' ? 'lg' : 'md'}
      centered
      backdrop={step === 'success' ? 'static' : true}
    >
      {step === 'confirm' && renderConfirmation()}
      {step === 'otp' && renderOTP()}
      {step === 'success' && renderSuccess()}
    </Modal>
  );
};

export default TransferWithOTP;
