import axios from 'axios';
import { buildRequestToPayPayload } from '../utils/requestToPayPayload';

export const sendRequestToPayRequest = async (sourceInfo, destinationInfo, amount, description = 'Payment request') => {
  const payload = buildRequestToPayPayload({
    amount: amount,
    source: {
      identifier: sourceInfo.identifier,
      type: sourceInfo.type || 'BANK',
      bankCode: sourceInfo.bankCode || '013',
      name: sourceInfo.name || 'Account Holder'
    },
    destination: {
      identifier: destinationInfo.identifier,
      type: destinationInfo.type || 'BANK',
      bankCode: destinationInfo.bankCode || '038',
      name: destinationInfo.name || 'Payer'
    },
    currency: 'TZS',
    description: description
  });

  console.log("Request to Pay payload:", payload, sessionStorage.getItem('requestToken'));
  return "success";
  
  // Uncomment below for actual API integration
  // try {
  //   const res = await axios.post('https://your-api-url.com/request-to-pay', payload, {
  //     headers: {
  //       'Authorization': `Bearer ${sessionStorage.getItem('requestToken')}`,
  //       'Content-Type': 'application/json',
  //     },
  //   });

  //   console.log('Request to Pay Success:', res.data);
  //   return res.data;
  // } catch (error) {
  //   console.error('Request to Pay Error:', error.response?.data || error.message);
  //   throw error;
  // }
};
