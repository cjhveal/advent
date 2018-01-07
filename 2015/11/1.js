const aCode = 97;
const modulus = 26;

function toCode(ch) { return ch.charCodeAt() - aCode }
function toChar(c) { return String.fromCharCode(c + aCode) }

function toCodes(password) {
  return password.split('').map(toCode);
}

function toPassword(codes) {
  return codes.map(toChar).join('');
}

function inc(codes) {
  codes[codes.length-1] += 1;

  for (let i = codes.length-1; i >= 0; i--) {
    let code = codes[i]
    if (i != 0) {
      codes[i-1] += Math.floor(codes[i]/modulus);
    }
    codes[i] = codes[i] % modulus;
  }

  return codes;
}


function threeConsecutive(codes) {
  let run;
  let lastCode = -10;
  for (let c of codes) {
    if (c === lastCode + 1) {
      run += 1
    } else {
      run = 1;
    }

    if (run === 3) {
      return true;
    }

    lastCode = c
  }

  return false;
}


function twoRepeats(codes) {
  let repeats = new Set();

  let lastChar = codes[0];
  for (let i = 1; i < codes.length; i++) {
    if (i === 0) continue;


    const c = codes[i];
    if (c !== lastChar) {
      lastChar = c;
      continue;
    }

    repeats.add(c)
    i += 1;
    lastChar = codes[i];
  }

  return repeats.size >= 2;
}


const forbiddenCodes = ['i', 'l', 'o'].map(toCode);
function noForbiddenCodes(codes) {
  return forbiddenCodes.every(f => codes.indexOf(f) === -1);
}

function isValid(codes) {
  return threeConsecutive(codes) && twoRepeats(codes) && noForbiddenCodes(codes);
}

function findNextPassword(password) {
  let codes = toCodes(password);

  do {
    inc(codes);
  } while (!isValid(codes));

  return toPassword(codes);
}

console.log(findNextPassword(findNextPassword('vzbxkghb')))
