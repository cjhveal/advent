const fs = require('fs');


const DEBUG=true;

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');
  const lines = input.split('\n');
  const numbers = lines.map(Number).sort((a,b) => a - b);

  const outletRating = 0;
  const lastRating = numbers[numbers.length-1];
  const deviceRating = lastRating + 3;


}

function test() {
  console.log(main());
}

test();
