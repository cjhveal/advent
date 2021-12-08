const fs = require('fs');


function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');
  const numbers = input.split('\n').map(Number)

  let lastNumber = null;
  let total = 0;
  for (const n of numbers) {
    if (lastNumber && lastNumber < n) {
      total += 1;
    }

    lastNumber = n;
  }

  return total;
}

function test() {
  console.log(main());
}

test();
