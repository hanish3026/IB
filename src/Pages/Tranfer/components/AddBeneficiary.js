import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const AddBeneficiary = ({ onSave, onCancel }) => {
  const [beneficiary, setBeneficiary] = useState({
    name: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    bankName: '',
    branch: '',
    nickName: ''
  });

  const [error, setError] = useState('');

  const validateForm = () => {
    if (!beneficiary.name || !beneficiary.accountNumber || !beneficiary.ifscCode) {
      setError('Please fill in all required fields');
      return false;
    }
    if (beneficiary.accountNumber !== beneficiary.confirmAccountNumber) {
      setError('Account numbers do not match');
      return false;
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(beneficiary.ifscCode)) {
      setError('Invalid IFSC Code format');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (validateForm()) {
      onSave(beneficiary);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBeneficiary(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3 border rounded">
      <h4 className="mb-4">Add New Beneficiary</h4>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Beneficiary Name*</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={beneficiary.name}
          onChange={handleChange}
          placeholder="Enter beneficiary name"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Account Number*</Form.Label>
        <Form.Control
          type="text"
          name="accountNumber"
          value={beneficiary.accountNumber}
          onChange={handleChange}
          placeholder="Enter account number"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Confirm Account Number*</Form.Label>
        <Form.Control
          type="text"
          name="confirmAccountNumber"
          value={beneficiary.confirmAccountNumber}
          onChange={handleChange}
          placeholder="Confirm account number"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>IFSC Code*</Form.Label>
        <Form.Control
          type="text"
          name="ifscCode"
          value={beneficiary.ifscCode}
          onChange={handleChange}
          placeholder="Enter IFSC code"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Bank Name</Form.Label>
        <Form.Control
          type="text"
          name="bankName"
          value={beneficiary.bankName}
          onChange={handleChange}
          placeholder="Enter bank name"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Branch</Form.Label>
        <Form.Control
          type="text"
          name="branch"
          value={beneficiary.branch}
          onChange={handleChange}
          placeholder="Enter branch name"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Nickname</Form.Label>
        <Form.Control
          type="text"
          name="nickName"
          value={beneficiary.nickName}
          onChange={handleChange}
          placeholder="Enter nickname (optional)"
        />
      </Form.Group>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Save Beneficiary
        </Button>
      </div>
    </Form>
  );
};

export default AddBeneficiary;
