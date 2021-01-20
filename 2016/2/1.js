const fs = require('fs');


const DEBUG=false;


const KEYPAD = [
  [1,2,3],
  [4,5,6],
  [7,8,9],
];


function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function keyClamp(n) {
  return clamp(n, 0, 2);
}


function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const allInstructions = input.split('\n').map(line => line.split(''))

  let x = 1;
  let y = 1;

  const digits = [];

  for (const digitInstructions of allInstructions) {
    for (const instruction of digitInstructions) {
      if (instruction === 'U') {
        y = keyClamp(y-1);
      } else if (instruction ==='D') {
        y = keyClamp(y+1);
      } else if (instruction === 'L') {
        x = keyClamp(x-1);
      } else if (instruction === 'R') {
        x = keyClamp(x+1)
      }
    }

    digits.push(KEYPAD[y][x]);
  }

  return digits.join('');
}

function test() {
  console.log(main());
}

test();
