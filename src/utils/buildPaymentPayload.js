// utils/buildPaymentPayload.js
export function buildPaymentPayload({
  payType,
  initiatedBy,
  serviceId,
  agentId,
  authRefNo,
  authId,
  amount,
  currency,
  source,
  destination,
  description = '',
}) {
  const unixTimestamp = String(Math.floor(Date.now() / 1000));

  return {
    reqdetails: {
      paytype: "EXIM-AGENCY",
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toLowerCase(),
      reqrefid: unixTimestamp,
      initiatedby: initiatedBy,
      primaryarg: {
        serviceid: serviceId,
        agentid: agentId,
        authrefno: authRefNo,
        authid: authId,
        transfers: {
          paytype: payType, // BILL, TOPUP, INTRAN, WALLET
          reqrefid: unixTimestamp,
          payfor: "WITHDRAW", // Assuming same for now
          trandetail: {
            tranamt: amount,
            trancurr: currency,
            sourcedtl: {
              identifier: source.identifier,
              identifiertype: source.type,
            },
            destinationdtl: {
              identifier: destination.identifier,
              identifiertype: destination.type,
            }
          },
          description
        }
      }
    }
  };
}
