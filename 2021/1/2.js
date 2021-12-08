const fs = require('fs');


function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');
  const numbers = input.split('\n').map(Number)

  let currentWindow = numbers[0] + numbers[1] + numbers[2];
  let total = 0;
  for (let i = 3; i < numbers.length; i++) {
    const nextWindow = currentWindow - numbers[i - 3] + numbers[i];

    if (nextWindow > currentWindow) {
      total += 1;
    }

    currentWindow = nextWindow;
  }

  return total;
}

function test() {
  console.log(main());
}

test();
