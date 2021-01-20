const fs = require('fs');


const DEBUG=false;


const KEYPAD = [
  [null,null,'1',null,null],
  [null,'2','3','4',null],
  ['5','6','7','8','9'],
  [null,'A','B','C',null],
  [null,null,'D',null,null],
];



function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const allInstructions = input.split('\n').map(line => line.split(''))

  let x = 0;
  let y = 2;

  const digits = [];


  for (const digitInstructions of allInstructions) {
    for (const instruction of digitInstructions) {
      if (instruction === 'U') {
        if (KEYPAD[y-1] && KEYPAD[y-1][x]) {
          y = y-1;
        }
      } else if (instruction ==='D') {
        if (KEYPAD[y+1] && KEYPAD[y+1][x]) {
          y = y+1;
        }
      } else if (instruction === 'L') {
        if (KEYPAD[y] && KEYPAD[y][x-1]) {
          x = x -1;
        }
      } else if (instruction === 'R') {
        if (KEYPAD[y] && KEYPAD[y][x+1]) {
          x = x+1;
        }
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
