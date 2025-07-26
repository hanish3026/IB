export function des (message, encrypt, mode, iv, padding) {
	let key="this is a 24 byte key !!";
  let spfunction1 = new Array (0x1010400,0,0x10000,0x1010404,0x1010004,0x10404,0x4,0x10000,0x400,0x1010400,0x1010404,0x400,0x1000404,0x1010004,0x1000000,0x4,0x404,0x1000400,0x1000400,0x10400,0x10400,0x1010000,0x1010000,0x1000404,0x10004,0x1000004,0x1000004,0x10004,0,0x404,0x10404,0x1000000,0x10000,0x1010404,0x4,0x1010000,0x1010400,0x1000000,0x1000000,0x400,0x1010004,0x10000,0x10400,0x1000004,0x400,0x4,0x1000404,0x10404,0x1010404,0x10004,0x1010000,0x1000404,0x1000004,0x404,0x10404,0x1010400,0x404,0x1000400,0x1000400,0,0x10004,0x10400,0,0x1010004);
  let spfunction2 = new Array (-0x7fef7fe0,-0x7fff8000,0x8000,0x108020,0x100000,0x20,-0x7fefffe0,-0x7fff7fe0,-0x7fffffe0,-0x7fef7fe0,-0x7fef8000,-0x80000000,-0x7fff8000,0x100000,0x20,-0x7fefffe0,0x108000,0x100020,-0x7fff7fe0,0,-0x80000000,0x8000,0x108020,-0x7ff00000,0x100020,-0x7fffffe0,0,0x108000,0x8020,-0x7fef8000,-0x7ff00000,0x8020,0,0x108020,-0x7fefffe0,0x100000,-0x7fff7fe0,-0x7ff00000,-0x7fef8000,0x8000,-0x7ff00000,-0x7fff8000,0x20,-0x7fef7fe0,0x108020,0x20,0x8000,-0x80000000,0x8020,-0x7fef8000,0x100000,-0x7fffffe0,0x100020,-0x7fff7fe0,-0x7fffffe0,0x100020,0x108000,0,-0x7fff8000,0x8020,-0x80000000,-0x7fefffe0,-0x7fef7fe0,0x108000);
  let spfunction3 = new Array (0x208,0x8020200,0,0x8020008,0x8000200,0,0x20208,0x8000200,0x20008,0x8000008,0x8000008,0x20000,0x8020208,0x20008,0x8020000,0x208,0x8000000,0x8,0x8020200,0x200,0x20200,0x8020000,0x8020008,0x20208,0x8000208,0x20200,0x20000,0x8000208,0x8,0x8020208,0x200,0x8000000,0x8020200,0x8000000,0x20008,0x208,0x20000,0x8020200,0x8000200,0,0x200,0x20008,0x8020208,0x8000200,0x8000008,0x200,0,0x8020008,0x8000208,0x20000,0x8000000,0x8020208,0x8,0x20208,0x20200,0x8000008,0x8020000,0x8000208,0x208,0x8020000,0x20208,0x8,0x8020008,0x20200);
  let spfunction4 = new Array (0x802001,0x2081,0x2081,0x80,0x802080,0x800081,0x800001,0x2001,0,0x802000,0x802000,0x802081,0x81,0,0x800080,0x800001,0x1,0x2000,0x800000,0x802001,0x80,0x800000,0x2001,0x2080,0x800081,0x1,0x2080,0x800080,0x2000,0x802080,0x802081,0x81,0x800080,0x800001,0x802000,0x802081,0x81,0,0,0x802000,0x2080,0x800080,0x800081,0x1,0x802001,0x2081,0x2081,0x80,0x802081,0x81,0x1,0x2000,0x800001,0x2001,0x802080,0x800081,0x2001,0x2080,0x800000,0x802001,0x80,0x800000,0x2000,0x802080);
  let spfunction5 = new Array (0x100,0x2080100,0x2080000,0x42000100,0x80000,0x100,0x40000000,0x2080000,0x40080100,0x80000,0x2000100,0x40080100,0x42000100,0x42080000,0x80100,0x40000000,0x2000000,0x40080000,0x40080000,0,0x40000100,0x42080100,0x42080100,0x2000100,0x42080000,0x40000100,0,0x42000000,0x2080100,0x2000000,0x42000000,0x80100,0x80000,0x42000100,0x100,0x2000000,0x40000000,0x2080000,0x42000100,0x40080100,0x2000100,0x40000000,0x42080000,0x2080100,0x40080100,0x100,0x2000000,0x42080000,0x42080100,0x80100,0x42000000,0x42080100,0x2080000,0,0x40080000,0x42000000,0x80100,0x2000100,0x40000100,0x80000,0,0x40080000,0x2080100,0x40000100);
  let spfunction6 = new Array (0x20000010,0x20400000,0x4000,0x20404010,0x20400000,0x10,0x20404010,0x400000,0x20004000,0x404010,0x400000,0x20000010,0x400010,0x20004000,0x20000000,0x4010,0,0x400010,0x20004010,0x4000,0x404000,0x20004010,0x10,0x20400010,0x20400010,0,0x404010,0x20404000,0x4010,0x404000,0x20404000,0x20000000,0x20004000,0x10,0x20400010,0x404000,0x20404010,0x400000,0x4010,0x20000010,0x400000,0x20004000,0x20000000,0x4010,0x20000010,0x20404010,0x404000,0x20400000,0x404010,0x20404000,0,0x20400010,0x10,0x4000,0x20400000,0x404010,0x4000,0x400010,0x20004010,0,0x20404000,0x20000000,0x400010,0x20004010);
  let spfunction7 = new Array (0x200000,0x4200002,0x4000802,0,0x800,0x4000802,0x200802,0x4200800,0x4200802,0x200000,0,0x4000002,0x2,0x4000000,0x4200002,0x802,0x4000800,0x200802,0x200002,0x4000800,0x4000002,0x4200000,0x4200800,0x200002,0x4200000,0x800,0x802,0x4200802,0x200800,0x2,0x4000000,0x200800,0x4000000,0x200800,0x200000,0x4000802,0x4000802,0x4200002,0x4200002,0x2,0x200002,0x4000000,0x4000800,0x200000,0x4200800,0x802,0x200802,0x4200800,0x802,0x4000002,0x4200802,0x4200000,0x200800,0,0x2,0x4200802,0,0x200802,0x4200000,0x800,0x4000002,0x4000800,0x800,0x200002);
  let spfunction8 = new Array (0x10001040,0x1000,0x40000,0x10041040,0x10000000,0x10001040,0x40,0x10000000,0x40040,0x10040000,0x10041040,0x41000,0x10041000,0x41040,0x1000,0x40,0x10040000,0x10000040,0x10001000,0x1040,0x41000,0x40040,0x10040040,0x10041000,0x1040,0,0,0x10040040,0x10000040,0x10001000,0x41040,0x40000,0x41040,0x40000,0x10041000,0x1000,0x40,0x10040040,0x1000,0x41040,0x10001000,0x40,0x10000040,0x10040000,0x10040040,0x10000000,0x40000,0x10001040,0,0x10041040,0x40040,0x10000040,0x10040000,0x10001000,0x10001040,0,0x10041040,0x41000,0x41000,0x1040,0x1040,0x40040,0x10000000,0x10041000);
  let keys = des_createKeys (key);
  let m=0, i, j, temp, temp2, right1, right2, left, right, looping;
  let cbcleft, cbcleft2, cbcright, cbcright2
  let endloop, loopinc;
  let len = message.length;
  let chunk = 0;
  let iterations = keys.length ===32 ? 3 : 9; 
  if (iterations ===3) {looping = encrypt ? new Array (0, 32, 2) : new Array (30, -2, -2);}
  else {looping = encrypt ? new Array (0, 32, 2, 62, 30, -2, 64, 96, 2) : new Array (94, 62, -2, 32, 64, 2, 30, -2, -2);}

  if (padding ===2) message += "        "; 
  else if (padding ===1) {temp = 8-(len%8); message += String.fromCharCode (temp,temp,temp,temp,temp,temp,temp,temp); if (temp===8) len+=8;} 
  else if (!padding) message += "\0\0\0\0\0\0\0\0"; 

  let result = "";
  let tempresult = "";

  if (mode === 1) { 
    cbcleft = (iv.charCodeAt(m++) << 24) | (iv.charCodeAt(m++) << 16) | (iv.charCodeAt(m++) << 8) | iv.charCodeAt(m++);
    cbcright = (iv.charCodeAt(m++) << 24) | (iv.charCodeAt(m++) << 16) | (iv.charCodeAt(m++) << 8) | iv.charCodeAt(m++);
    m=0;
  }

  while (m < len) {
    left = (message.charCodeAt(m++) << 24) | (message.charCodeAt(m++) << 16) | (message.charCodeAt(m++) << 8) | message.charCodeAt(m++);
    right = (message.charCodeAt(m++) << 24) | (message.charCodeAt(m++) << 16) | (message.charCodeAt(m++) << 8) | message.charCodeAt(m++);

    if (mode === 1) {if (encrypt) {left ^= cbcleft; right ^= cbcright;} else {cbcleft2 = cbcleft; cbcright2 = cbcright; cbcleft = left; cbcright = right;}}

    temp = ((left >>> 4) ^ right) & 0x0f0f0f0f; right ^= temp; left ^= (temp << 4);
    temp = ((left >>> 16) ^ right) & 0x0000ffff; right ^= temp; left ^= (temp << 16);
    temp = ((right >>> 2) ^ left) & 0x33333333; left ^= temp; right ^= (temp << 2);
    temp = ((right >>> 8) ^ left) & 0x00ff00ff; left ^= temp; right ^= (temp << 8);
    temp = ((left >>> 1) ^ right) & 0x55555555; right ^= temp; left ^= (temp << 1);

    left = ((left << 1) | (left >>> 31)); 
    right = ((right << 1) | (right >>> 31)); 

    for (j=0; j<iterations; j+=3) {
      endloop = looping[j+1];
      loopinc = looping[j+2];
      for (i=looping[j]; i!=endloop; i+=loopinc) { 
        right1 = right ^ keys[i]; 
        right2 = ((right >>> 4) | (right << 28)) ^ keys[i+1];
        temp = left;
        left = right;
        right = temp ^ (spfunction2[(right1 >>> 24) & 0x3f] | spfunction4[(right1 >>> 16) & 0x3f]
              | spfunction6[(right1 >>>  8) & 0x3f] | spfunction8[right1 & 0x3f]
              | spfunction1[(right2 >>> 24) & 0x3f] | spfunction3[(right2 >>> 16) & 0x3f]
              | spfunction5[(right2 >>>  8) & 0x3f] | spfunction7[right2 & 0x3f]);
      }
      temp = left; left = right; right = temp; 
    } 

    left = ((left >>> 1) | (left << 31)); 
    right = ((right >>> 1) | (right << 31)); 

    temp = ((left >>> 1) ^ right) & 0x55555555; right ^= temp; left ^= (temp << 1);
    temp = ((right >>> 8) ^ left) & 0x00ff00ff; left ^= temp; right ^= (temp << 8);
    temp = ((right >>> 2) ^ left) & 0x33333333; left ^= temp; right ^= (temp << 2);
    temp = ((left >>> 16) ^ right) & 0x0000ffff; right ^= temp; left ^= (temp << 16);
    temp = ((left >>> 4) ^ right) & 0x0f0f0f0f; right ^= temp; left ^= (temp << 4);

    if (mode ===1) {if (encrypt) {cbcleft = left; cbcright = right;} else {left ^= cbcleft2; right ^= cbcright2;}}
    tempresult += String.fromCharCode ((left>>>24), ((left>>>16) & 0xff), ((left>>>8) & 0xff), (left & 0xff), (right>>>24), ((right>>>16) & 0xff), ((right>>>8) & 0xff), (right & 0xff));

    chunk += 8;
    if (chunk ===512) {result += tempresult; tempresult = ""; chunk = 0;}
  } 

  return result + tempresult;
}
function des_createKeys (key) {
    let pc2bytes0  = new Array (0,0x4,0x20000000,0x20000004,0x10000,0x10004,0x20010000,0x20010004,0x200,0x204,0x20000200,0x20000204,0x10200,0x10204,0x20010200,0x20010204);
    let pc2bytes1  = new Array (0,0x1,0x100000,0x100001,0x4000000,0x4000001,0x4100000,0x4100001,0x100,0x101,0x100100,0x100101,0x4000100,0x4000101,0x4100100,0x4100101);
    let pc2bytes2  = new Array (0,0x8,0x800,0x808,0x1000000,0x1000008,0x1000800,0x1000808,0,0x8,0x800,0x808,0x1000000,0x1000008,0x1000800,0x1000808);
    let pc2bytes3  = new Array (0,0x200000,0x8000000,0x8200000,0x2000,0x202000,0x8002000,0x8202000,0x20000,0x220000,0x8020000,0x8220000,0x22000,0x222000,0x8022000,0x8222000);
    let pc2bytes4  = new Array (0,0x40000,0x10,0x40010,0,0x40000,0x10,0x40010,0x1000,0x41000,0x1010,0x41010,0x1000,0x41000,0x1010,0x41010);
    let pc2bytes5  = new Array (0,0x400,0x20,0x420,0,0x400,0x20,0x420,0x2000000,0x2000400,0x2000020,0x2000420,0x2000000,0x2000400,0x2000020,0x2000420);
    let pc2bytes6  = new Array (0,0x10000000,0x80000,0x10080000,0x2,0x10000002,0x80002,0x10080002,0,0x10000000,0x80000,0x10080000,0x2,0x10000002,0x80002,0x10080002);
    let pc2bytes7  = new Array (0,0x10000,0x800,0x10800,0x20000000,0x20010000,0x20000800,0x20010800,0x20000,0x30000,0x20800,0x30800,0x20020000,0x20030000,0x20020800,0x20030800);
    let pc2bytes8  = new Array (0,0x40000,0,0x40000,0x2,0x40002,0x2,0x40002,0x2000000,0x2040000,0x2000000,0x2040000,0x2000002,0x2040002,0x2000002,0x2040002);
    let pc2bytes9  = new Array (0,0x10000000,0x8,0x10000008,0,0x10000000,0x8,0x10000008,0x400,0x10000400,0x408,0x10000408,0x400,0x10000400,0x408,0x10000408);
    let pc2bytes10 = new Array (0,0x20,0,0x20,0x100000,0x100020,0x100000,0x100020,0x2000,0x2020,0x2000,0x2020,0x102000,0x102020,0x102000,0x102020);
    let pc2bytes11 = new Array (0,0x1000000,0x200,0x1000200,0x200000,0x1200000,0x200200,0x1200200,0x4000000,0x5000000,0x4000200,0x5000200,0x4200000,0x5200000,0x4200200,0x5200200);
    let pc2bytes12 = new Array (0,0x1000,0x8000000,0x8001000,0x80000,0x81000,0x8080000,0x8081000,0x10,0x1010,0x8000010,0x8001010,0x80010,0x81010,0x8080010,0x8081010);
    let pc2bytes13 = new Array (0,0x4,0x100,0x104,0,0x4,0x100,0x104,0x1,0x5,0x101,0x105,0x1,0x5,0x101,0x105);
  
    let iterations = key.length > 8 ? 3 : 1; 
    let keys = new Array (32 * iterations);
    let shifts = new Array (0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0);
    let lefttemp, righttemp, m=0, n=0, temp;
  
    for (let j=0; j<iterations; j++) { 
        let left = (key.charCodeAt(m++) << 24) | (key.charCodeAt(m++) << 16) | (key.charCodeAt(m++) << 8) | key.charCodeAt(m++);
        let right = (key.charCodeAt(m++) << 24) | (key.charCodeAt(m++) << 16) | (key.charCodeAt(m++) << 8) | key.charCodeAt(m++);
  
      temp = ((left >>> 4) ^ right) & 0x0f0f0f0f; right ^= temp; left ^= (temp << 4);
      temp = ((right >>> -16) ^ left) & 0x0000ffff; left ^= temp; right ^= (temp << -16);
      temp = ((left >>> 2) ^ right) & 0x33333333; right ^= temp; left ^= (temp << 2);
      temp = ((right >>> -16) ^ left) & 0x0000ffff; left ^= temp; right ^= (temp << -16);
      temp = ((left >>> 1) ^ right) & 0x55555555; right ^= temp; left ^= (temp << 1);
      temp = ((right >>> 8) ^ left) & 0x00ff00ff; left ^= temp; right ^= (temp << 8);
      temp = ((left >>> 1) ^ right) & 0x55555555; right ^= temp; left ^= (temp << 1);
  
      temp = (left << 8) | ((right >>> 20) & 0x000000f0);
      left = (right << 24) | ((right << 8) & 0xff0000) | ((right >>> 8) & 0xff00) | ((right >>> 24) & 0xf0);
      right = temp;
  
      for (let i=0; i < shifts.length; i++) {
        if (shifts[i]) {left = (left << 2) | (left >>> 26); right = (right << 2) | (right >>> 26);}
        else {left = (left << 1) | (left >>> 27); right = (right << 1) | (right >>> 27);}
        left &= -0xf; right &= -0xf;
  
        lefttemp = pc2bytes0[left >>> 28] | pc2bytes1[(left >>> 24) & 0xf]
                | pc2bytes2[(left >>> 20) & 0xf] | pc2bytes3[(left >>> 16) & 0xf]
                | pc2bytes4[(left >>> 12) & 0xf] | pc2bytes5[(left >>> 8) & 0xf]
                | pc2bytes6[(left >>> 4) & 0xf];
        righttemp = pc2bytes7[right >>> 28] | pc2bytes8[(right >>> 24) & 0xf]
                  | pc2bytes9[(right >>> 20) & 0xf] | pc2bytes10[(right >>> 16) & 0xf]
                  | pc2bytes11[(right >>> 12) & 0xf] | pc2bytes12[(right >>> 8) & 0xf]
                  | pc2bytes13[(right >>> 4) & 0xf];
        temp = ((righttemp >>> 16) ^ lefttemp) & 0x0000ffff; 
        keys[n++] = lefttemp ^ temp; keys[n++] = righttemp ^ (temp << 16);
      }
    } 
    return keys;
  } 

  export function doEncrypt(encryptText,encryptionKey) {
    let sc = new SecureContext(encryptText,"", "1");
    sc.secure(encryptionKey);
    return sc.strText;
  }

  export class SecureContext {
  constructor(strText, strSignature, bEscape) {
    this.strSIGNATURE = strSignature || '';
    this.bESCApE = bEscape || false;
    this.strText = strText;
    this.escape = SecureContext_escape;
    this.unescape = SecureContext_unescape;
    this.transliterate = SecureContext_transliterate;
    this.encypher = SecureContext_encypher;
    this.decypher = SecureContext_decypher;
    this.sign = SecureContext_sign;
    this.unsign = SecureContext_unsign;
    this.secure = SecureContext_secure;
    this.unsecure = SecureContext_unsecure;
  }
}
function SecureContext_escape(strToEscape) {
  let strEscaped = '';
  for (let i = 0; i < strToEscape.length; i++) {
  let chT = strToEscape.charAt( i );
  switch(chT) {
  case '\r': strEscaped += '\\r'; break;
  case '\n': strEscaped += '\\n'; break;
  case '\\': strEscaped += '\\\\'; break;
  default: strEscaped += chT;
     }
  }
  return strEscaped;
  }

  function SecureContext_unescape(strToUnescape) {
    let strUnescaped = '';
    let i = 0;
    while (i < strToUnescape.length) {
    let chT = strToUnescape.charAt(i++);
    if ('\\' === chT) {
    chT = strToUnescape.charAt( i++ );
    switch( chT ) {
    case 'r': strUnescaped += '\r'; break;
    case 'n': strUnescaped += '\n'; break;
    case '\\': strUnescaped += '\\'; break;
    default: 
       }
    }
    else strUnescaped += chT;
    }
    return strUnescaped;
    }

    function SecureContext_transliterate(btransliterate) {
      let strDest = '';
      
      let nTextIter  = 0;
      let nTexttrail = 0;
      
      while (nTextIter < this.strText.length) {
      let strRun = '';
      let cSkipped   = 0;
      while (cSkipped < 7 && nTextIter < this.strText.length) {
      let chT = this.strText.charAt(nTextIter++);
      if (-1 === strRun.indexOf(chT)) {
      strRun += chT;
      cSkipped = 0;
      }
      else cSkipped++;
      }
      while (nTexttrail < nTextIter) {
      let nRunIdx = strRun.indexOf(this.strText.charAt(nTexttrail++));
      if (btransliterate) {
      nRunIdx++
      if (nRunIdx === strRun.length) nRunIdx = 0;
      }
      else {
      nRunIdx--;
      if (nRunIdx === -1) nRunIdx += strRun.length;
      }
      strDest += strRun.charAt(nRunIdx);
         }
      }
      this.strText = strDest;
      }
      function SecureContext_encypher(anperm) {
        let strEncyph = '';
        
        let nCols     = anperm.length;
        let nRows     = this.strText.length / nCols;
        for (let i = 0; i < nCols; i++) {
        let k = anperm[ i ];
        for (let j = 0; j < nRows; j++) {
        strEncyph += this.strText.charAt(k);
        k         += nCols;
           }
        }
        this.strText = strEncyph;
        }
        function SecureContext_decypher(anperm) {
        let nRows    = anperm.length;
        let nCols    = this.strText.length / nRows;
        let anRowOfs = new Array;
        for (let i = 0 ; i < nRows; i++) anRowOfs[ anperm[ i ] ] = i * nCols;
        let strplain = '';
        for (let i = 0; i < nCols; i++) {
        for (let j = 0; j < nRows; j++)
        strplain += this.strText.charAt(anRowOfs[ j ] + i);
        }
        this.strText = strplain;
        }
        function SecureContext_sign(nCols) {
        if (this.bESCApE) {
        this.strText      = this.escape(this.strText);
        this.strSIGNATURE = this.escape(this.strSIGNATURE);
        }
        let nTextLen     = this.strText.length + this.strSIGNATURE.length;
        let nMissingCols = nCols - (nTextLen % nCols);
        let strpadding   = '';  
        if (nMissingCols < nCols)
        for (let i = 0; i < nMissingCols; i++) strpadding += ' ';
        let x = this.strText.length;
        this.strText +=  strpadding + this.strSIGNATURE;
        }
        function SecureContext_unsign(nCols) {
        if (this.bESCApE) {
        this.strText      = this.unescape(this.strText);
        this.strSIGNATURE = this.unescape(this.strSIGNATURE);
        }
        if ('' === this.strSIGNATURE) return true;
        let nTextLen = this.strText.lastIndexOf(this.strSIGNATURE);
        if (-1 === nTextLen) return false;
        this.strText = this.strText.substr(0, nTextLen);
        return true;
        }
        function SecureContext_secure(strpasswd) {
        let passwd = new password(strpasswd);
        let anperm   = passwd.getpermutation()
        this.sign(anperm.length);
        this.transliterate(true);
        this.encypher(anperm);
        }
        function SecureContext_unsecure(strpasswd) {
        let passwd = new password(strpasswd);
        let anperm = passwd.getpermutation()
        this.decypher(anperm);
        this.transliterate(false);
        return this.unsign(anperm.length);
        }
        class password {
  constructor(strpasswd) {
    this.strpasswd = strpasswd;
    this.getHashValue = password_getHashValue;
    this.getpermutation = password_getpermutation;
  }
}
function password_getHashValue() {
  let m = 907633409;
  let a = 65599;
  let h = 0;
  for (let i = 0; i < this.strpasswd.length; i++) 
  h = (h % m) * a + this.strpasswd.charCodeAt(i);
  return h;
  }
  function password_getpermutation() {
  let nNUMELEMENTS = 13;
  let nCYCLELENGTH = 21;
  let pg = new permutationGenerator(nNUMELEMENTS);
  let anCycle = new Array(nCYCLELENGTH);
  let npred   = this.getHashValue();
  for (let i = 0; i < nCYCLELENGTH; i++) {
  npred = 314159269 * npred + 907633409;
  anCycle[i] = npred % pg.nNumtranspositions;
  }
  return pg.fromCycle(anCycle);
  }

  function permutationGenerator(nNumElements) {
    this.nNumElements     = nNumElements;
    this.antranspositions = new Array;
    let k = 0;
    for (let i = 0; i < nNumElements - 1; i++)
    for (let j = i + 1; j < nNumElements; j++)
    this.antranspositions[ k++ ] = ( i << 8 ) | j;
    this.nNumtranspositions = k;
    this.fromCycle = permutationGenerator_fromCycle;
    }
    function permutationGenerator_fromCycle(anCycle) {
    let anpermutation = new Array(this.nNumElements);
    for (let i = 0; i < this.nNumElements; i++) anpermutation[i] = i;
    for (let i = 0; i < anCycle.length; i++) {
    let nT = this.antranspositions[anCycle[i]];
    let n1 = nT & 255;
    let n2 = (nT >> 8) & 255;
    nT = anpermutation[n1];
    anpermutation[n1] = anpermutation[n2];
    anpermutation[n2] = nT;
    }
    return anpermutation;
    }