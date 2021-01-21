const fs = require('fs');


const DEBUG=false;

function runTestCases(fn, testCases) {
    for (const [input, expected] of testCases) {
      const actual = fn(input);
      console.log(input, expected, actual);
    }
}

function decompressedLength(input) {
  let total = 0;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === '(') {
      let marker = '';
      // skip open paren
      i += 1;
      while (input[i] !== ')') {
        marker += input[i];
        i += 1;
      }
      const [size, count] = marker.split('x').map(x => Number(x));

      let steps = 0;
      while (i < input.length && steps < size) {
        steps += 1;
        i += 1;
        total += count;
      }
    } else {
      // literal char
      total += 1;
    }
  }

  return total;
}

function testExamples() {
  runTestCases(decompressedLength, [
    ['ADVENT', 6],
    ['A(1x5)BC', 7],
    ['A(2x2)BCD(2x2)EFG', 11],
    ['(6x1)(1x3)A', 6],
    ['X(8x2)(3x3)ABCY', 18]
  ]);
}
//testExamples();


function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  return decompressedLength(input);
}

function test() {
  console.log(main());
}

test();
