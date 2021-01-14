const fs = require('fs');


function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');
  const numbers = input.split('\n').map(Number)
  for (const n of numbers) {
    const delta = 2020 - n;
    const other = numbers.find(x => x === delta);
    if (other) {
      return n * other;
    }
  }
}

function test() {
  console.log(main());
}

test();
