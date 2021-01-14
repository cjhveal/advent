const fs = require('fs');


function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');
  const numbers = input.split('\n').map(Number)
  for (const a of numbers) {
    for (const b of numbers) {
      for (const c of numbers) {
        if (a + b + c === 2020) {
          console.log(a,b,c, a+b+c);
          return a * b * c;
        }
      }
    }
  }
}

function test() {
  console.log(main());
}

test();
