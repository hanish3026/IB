import axios from 'axios';
import { builLookupPayload } from '../utils/builLookupPayload';

export const sendLookupRequest = async (accountNumber, identifierType, bankCode) => {
  const payload = builLookupPayload({
    paytype: "TIPS",
    initiatedBy: 'Ragini',
    acno: accountNumber,
    identifiertype: identifierType,
    bankcode: bankCode
  });
  
  console.log("lookup payload", payload, sessionStorage.getItem('token'));
  return {
    "resdetails": {
        "paytype": "EXIM-AGENCY",
        "date": "23-JaN-2025",
        "reqrefid": "18DdDD10d00d",     
        "initiatedby": "AGT2024103000001",
        "primaryarg": {
            "serviceid": "AG240",
            "agentid": "AGT2024103000001",
            "acinfo": {
                "acno": accountNumber,
                "prielements": {
                    "identifier": accountNumber,
                    "status": "Active"
                },
                "secelements": {
                    "Currency": "DJF",
                    "Balance": "2200",
                    "fullname": "DEOGRATIUS BONIVENTURE MUNISHI"
                }
            }
        }
    },
    "result": "success",
    "stscode": "AB000",
    "message": "compte trouvé !!"
};
  // Uncomment below to make actual API call
  // try {
  //   const res = await axios.post('https://your-api-url.com/lookup', payload, {
  //     headers: {
  //       'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
  //       'Content-Type': 'application/json',
  //     },
  //   });

  //   console.log('Lookup Success:', res.data);
  //   return res.data;
  // } catch (error) {
  //   console.error('Lookup Error:', error.response?.data || error.message);
  //   throw error;
  // }
}; 