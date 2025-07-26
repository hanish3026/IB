export function buildRequestToPayPayload({
  amount,
  source,
  destination,
  currency = 'TZS',
  description ,
  sourceAccountCategory = 'PERSON',
  destinationAccountCategory = 'BANK',
  feeAmount = '0',
  feeCurrency = 'TZS',
  totalPayments = '0',
  balanceAmount = '0',
  payDueDate="",
}) {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  }).toLowerCase();
  
  const unixTimestamp = String(Math.floor(Date.now() / 1000));
  const reqRefId = `RP${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}${String(currentDate.getDate()).padStart(2, '0')}MBEXIM${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}${String(currentDate.getDate()).padStart(2, '0')}${currentDate.getHours()}${currentDate.getMinutes()}${currentDate.getSeconds()}${String(currentDate.getMilliseconds()).padStart(3, '0')}`;
  
  // Default pay due date (5 days from now)
  const defaultPayDueDate = new Date();
  defaultPayDueDate.setDate(defaultPayDueDate.getDate() + 5);
  const formattedPayDueDate = payDueDate || defaultPayDueDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }) + ' ' + defaultPayDueDate.toLocaleTimeString('en-GB', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }) + ' ';

  // Generate transaction reference ID if not provided
//   const transactionRefId = tranRefId || `013-R2P${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;

  return {
    transfereq: {
      paytype: "TIPS",
      date: formattedDate,
      reqrefid: reqRefId,
      payduedate: formattedPayDueDate,
      initiatedby: "TIPS",
      trantype: "TRANSFER",
      payoption: "EXACT",
      description: description,
      trandetail: {
        tranrefid: reqRefId,
        tranamt: String(amount),
        trancurr: currency
      },
      sourcedtl: {
        s_identifier: source.identifier,
        s_identifiertype: source.type || "BUSINESS",
        s_bic: source.bankCode || "013",
        s_accoutname: source.name,
        s_accountcategory:  sourceAccountCategory || "PERSON",
        s_actype: "BANK",
        s_identify: { 

            type: "NIN", 
    
            value: "19501007111010000126" 
    
          }, 
        fee: {
          feeamt: feeAmount || "0"  ,
          feecurr: feeCurrency || "TZS" 
        }
      },
      destinationdtl: {
        d_identifier: destination.identifier,
        d_identifiertype: destination.type || "BUSINESS",
        d_bic: destination.bankCode || "038",
        d_accountcategory: destinationAccountCategory || "PERSON",
        d_actype: "PERSON",
        d_identify: { 

            type: "NIN", 
    
            value: "19501007111010000126" 
    
          }, 
        d_accoutname: destination.name
      },
      payhistory: {
        totalpayments: totalPayments || "0",
        paidamount: String(amount),
        balamount: balanceAmount || "0"
      }
    }
  };
}

