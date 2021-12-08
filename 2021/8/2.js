const fs = require('fs');


function sortSegments(str) {
  return [...str].sort().join('')
}

function countCommonSegments(pattern1, pattern2) {
  let total = 0;

  for (const segment of pattern2.split('')) {
    if (pattern1.includes(segment)) {
      total += 1;
    }
  }

  return total;
}


function findDigitMap(signalPatterns) {
  const byLength = {}
  for (const pattern of signalPatterns) {
    const len = pattern.length;
    byLength[len] = byLength[len] || [];
    byLength[len].push(pattern);
  }

  const digitMap = {};

  // 1 is the only 2 segment digit
  digitMap[1] = byLength[2][0]

  // 7 is the only 3 segment digit
  digitMap[7] = byLength[3][0]

  // 4 is the only 4 segment digit
  digitMap[4] = byLength[4][0]

  // 8 is the only 7 segment digit
  digitMap[8] = byLength[7][0]

  // 2, 3, 5 are all 5 segment digits
  // 3 shares all segments with 7
  digitMap[3] = byLength[5].find(pattern => countCommonSegments(pattern, digitMap[7]) === 3)

  // 2 only shares 2 segments with 4
  digitMap[2] = byLength[5].find(pattern => countCommonSegments(pattern, digitMap[4]) === 2)

  // 5 is the remaining one
  digitMap[5] = byLength[5].find(pattern => pattern !== digitMap[3] && pattern !== digitMap[2])

  // 0, 6, 9 are all 6 segment digits
  // 9 shares all segments with 4
  digitMap[9] = byLength[6].find(pattern => countCommonSegments(pattern, digitMap[4]) === 4)

  // 6 is the only one that doesn't share all with 1
  digitMap[6] = byLength[6].find(pattern => countCommonSegments(pattern, digitMap[1]) !== 2)

  // 0 is the remaining one
  digitMap[0] = byLength[6].find(pattern => pattern !== digitMap[9] && pattern !== digitMap[6])



  const finalMap = {};
  for (const digit of Object.keys(digitMap)) {
    const pattern = sortSegments(digitMap[digit]);

    finalMap[pattern] = digit;
  }

  return finalMap;
}

function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const lines = input.trim().split('\n')
  //const lines = [MICRO_EXAMPLE]

  const entries = lines.map(entry => entry.split(' | ').map(x => x.trim().split(' ')));

  let total = 0;
  for (const entry of entries) {
    const [signalPatterns, outputPatterns] = entry;

    const digitMap = findDigitMap(signalPatterns);
    const sortedPatterns = outputPatterns.map(pattern => sortSegments(pattern))

    const digits = outputPatterns.map(pattern => digitMap[sortSegments(pattern)])
    const outputNumber = parseInt(digits.join(''), 10);

    total += outputNumber;
  }

  return total;
}

const MICRO_EXAMPLE = `acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf`

function test() {
  console.log(main('input.txt'));
}

function example() {
  console.log(main('example.txt'));
}

//example();
test();
