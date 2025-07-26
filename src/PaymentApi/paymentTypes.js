// PaymentApi/paymentTypes.js
export const PAYMENT_TYPES = {
  BILL: 'BILL',
  TOPUP: 'TOPUP',
  INTRAN: 'INTRAN',
  WALLET: 'WALLET',
  TRANSFER: 'TRANSFER'
};

export const IDENTIFIER_TYPES = {
  BANK: 'BANK',
  MOBILE: 'MOBILE',
  WALLET: 'WALLET',
  ACCOUNT: 'ACCOUNT'
};

// Helper function to validate payment request
export const validatePaymentRequest = (paymentType, sourceInfo, destinationInfo) => {
  const errors = [];

  // Validate payment type
  if (!paymentType || !Object.values(PAYMENT_TYPES).includes(paymentType)) {
    errors.push(`Invalid payment type. Must be one of: ${Object.values(PAYMENT_TYPES).join(', ')}`);
  }

  // Validate source info
  if (!sourceInfo) {
    errors.push('Source information is required');
  } else {
    if (!sourceInfo.identifier) errors.push('Source identifier is required');
    if (!sourceInfo.type || !Object.values(IDENTIFIER_TYPES).includes(sourceInfo.type)) {
      errors.push(`Invalid source type. Must be one of: ${Object.values(IDENTIFIER_TYPES).join(', ')}`);
    }
  }

  // Validate destination info
  if (!destinationInfo) {
    errors.push('Destination information is required');
  } else {
    if (!destinationInfo.identifier) errors.push('Destination identifier is required');
    if (!destinationInfo.type || !Object.values(IDENTIFIER_TYPES).includes(destinationInfo.type)) {
      errors.push(`Invalid destination type. Must be one of: ${Object.values(IDENTIFIER_TYPES).join(', ')}`);
    }
  }

  return errors;
};

// Helper function to create payment examples
export const createPaymentExamples = () => {
  return {
    billPayment: {
      type: PAYMENT_TYPES.BILL,
      source: { identifier: '202411040003', type: IDENTIFIER_TYPES.BANK },
      destination: { identifier: '202411040001', type: IDENTIFIER_TYPES.BANK },
      options: { amount: '1000', currency: 'TZS', description: 'Electricity bill payment' }
    },
    mobileTopup: {
      type: PAYMENT_TYPES.TOPUP,
      source: { identifier: '202411040003', type: IDENTIFIER_TYPES.BANK },
      destination: { identifier: '+255123456789', type: IDENTIFIER_TYPES.MOBILE },
      options: { amount: '5000', currency: 'TZS', description: 'Mobile airtime topup' }
    },
    walletTransfer: {
      type: PAYMENT_TYPES.WALLET,
      source: { identifier: '202411040003', type: IDENTIFIER_TYPES.BANK },
      destination: { identifier: 'WLT123456789', type: IDENTIFIER_TYPES.WALLET },
      options: { amount: '25000', currency: 'TZS', description: 'Wallet funding' }
    },
    bankTransfer: {
      type: PAYMENT_TYPES.INTRAN,
      source: { identifier: '202411040003', type: IDENTIFIER_TYPES.BANK },
      destination: { identifier: '202411040005', type: IDENTIFIER_TYPES.BANK },
      options: { amount: '50000', currency: 'TZS', description: 'Internal bank transfer' }
    }
  };
}; 