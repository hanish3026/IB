import axios from 'axios';
import { buildPaymentPayload } from '../utils/buildPaymentPayload';

export const sendPaymentRequest = async (paymentType, sourceInfo, destinationInfo,amount) => {
  const payload = buildPaymentPayload({
    payType: paymentType, // e.g. 'TOPUP'
    initiatedBy: 'AGT2024103000001',
    serviceId: 'AG260',
    agentId: 'AGT2024103000001',
    authRefNo: String(Date.now()),
    authId: '240883',
    amount: amount,
    currency: 'DJF',
    source: sourceInfo,
    destination: destinationInfo,
    description: 'Transfer for service',
  });
  console.log("payload",payload,sessionStorage.getItem('token'));
  return "success";
  // try {
  //   const res = await axios.post('https://your-api-url.com/payment', payload, {
  //     headers: {
  //       'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
  //       'Content-Type': 'application/json',
  //     },
  //   });

  //   console.log('Payment Success:', res.data);
  //   return res.data;
  // } catch (error) {
  //   sessionStorage.getItem('token');
  //   console.error('Payment Error:', error.response?.data || error.message);
  //   throw error;
  // }
};
