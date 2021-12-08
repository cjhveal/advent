const fs = require('fs');

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');
  const binaryNumbers = input.split('\n');

  const bitDepth = binaryNumbers[0].length;

  const counters = new Array(bitDepth).fill(0).map(x => ({
    "0": 0,
    "1": 1,
  }))

  for (const binaryNumber of binaryNumbers) {
    const digits = binaryNumber.split('');

    for (let i = 0; i < digits.length; i++) {
      const digit = digits[i];

      counters[i][digit] += 1;
    }
  }

  const gammaDigits = [];
  const epsilonDigits = [];

  for (let i = 0; i < counters.length; i++){
    const counter = counters[i];

    if (counter["0"] > counter["1"]) {
      gammaDigits.push("0");
      epsilonDigits.push("1");
    } else {
      gammaDigits.push("1");
      epsilonDigits.push("0");
    }
  }

  const gamma = parseInt(gammaDigits.join(''), 2);
  const epsilon = parseInt(epsilonDigits.join(''), 2);


  return gamma * epsilon;
}

function binaryDigitsToDec(digits) {
    return parseInt(digits.join(), 2);
}


function test() {
  console.log(main());
}

test();
