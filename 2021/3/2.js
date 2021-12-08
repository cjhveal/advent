const fs = require('fs');

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const diagnosticDigits = input.split('\n').map(n => n.split(''));
  const bitDepth = diagnosticDigits[0].length;

  let o2Digits = diagnosticDigits;
  let co2Digits = diagnosticDigits;

  for (let i = 0; i < bitDepth; i++) {
    const o2Count = countDigitFrequency(o2Digits, i);
    const o2Criteria = o2Count[1] >= o2Count[0] ? "1" : "0";
    o2Digits = o2Digits.filter(digits => digits[i] === o2Criteria);
    if (o2Digits.length <= 1) {
      break;
    }
  }

  for (let i = 0; i < bitDepth; i++) {
    const co2Count = countDigitFrequency(co2Digits, i);
    const co2Criteria = co2Count[0] <= co2Count[1] ? "0" : "1";
    co2Digits = co2Digits.filter(digits => digits[i] === co2Criteria);

    if (co2Digits.length <= 1) {
      break;
    }
  }

  const o2Rating = parseInt(o2Digits[0].join(''), 2);
  const co2Rating = parseInt(co2Digits[0].join(''), 2);


  return o2Rating * co2Rating;
}

function countDigitFrequency(diagnosticDigits, digitIndex) {
  const bitDepth = diagnosticDigits[0].length;

  const counters = [0, 0];

  for (const digits of diagnosticDigits) {
    const digit = digits[digitIndex];

    counters[digit] += 1;
  }

  return counters;
}



function test() {
  console.log(main());
}

test();
