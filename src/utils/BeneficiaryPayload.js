export function BeneficiaryPayload({sourcedtl}) {
  const currentDate = new Date();

  const reqRefId = `RP${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}${String(currentDate.getDate()).padStart(2, '0')}MBEXIM${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}${String(currentDate.getDate()).padStart(2, '0')}${currentDate.getHours()}${currentDate.getMinutes()}${currentDate.getSeconds()}${String(currentDate.getMilliseconds()).padStart(3, '0')}`;
    const dateObj = new Date();
    const date = dateObj.getFullYear() + '-' +
                 String(dateObj.getMonth() + 1).padStart(2, '0') + '-' +
                 String(dateObj.getDate()).padStart(2, '0');
    
    return {
      BeneficiaryPayLoad:{
        "reqdetails": {
          "paytype":sourcedtl.transferType,
          "date": date,
          "reqrefid": reqRefId,
          "initiatedby": sessionStorage.getItem('userName'),
          "primaryarg": {
            "sourcedtl": {
              "PAYTYPE": sourcedtl.transferType,
              "PAYEEACNO": sourcedtl.accountNo,
              "PAYEENAME": sourcedtl.beneficiaryName,
              "BICCODE": sourcedtl.bankIdentificationCode,
              "IBANNO": sourcedtl.ibanNumber,
              "NICKNAME": sourcedtl.nickName,
              "BANKCD": sourcedtl.bankIdentificationCode,
              "BANKNAME": sourcedtl.bankName,
              "BRANCH": sourcedtl.branchName,
              "COUNTRYCD": sourcedtl.countryCode,
              "CURRENCY": sourcedtl.currencyCode,
              "REFERENCENO": reqRefId,
              "EMAILID": sourcedtl.emailId,
              "MCALLCD": "91",
              "MOBILE": sourcedtl.mobileNo,
              "STATUS": "1",
              "REMARKS": sourcedtl.remarks
            }
          }
        }
      }
    };
  }
  