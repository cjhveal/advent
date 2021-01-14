const fs = require('fs');


const DEBUG=true;

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');
  const lines = input.split('\n');
  const numbers = lines.map(Number).sort((a,b) => a - b);

  const outletRating = 0;
  const lastRating = numbers[numbers.length-1];
  const deviceRating = lastRating + 3;

  const chain = [outletRating, ...numbers, deviceRating]

  const deltaCounts = [0,0,0,0];
  for (let i = 1; i < chain.length; i++) {
    const num = chain[i];
    const prevNum = chain[i-1];

    const delta = (num - prevNum);
    deltaCounts[delta] = deltaCounts[delta] + 1;
  }

  console.log(deltaCounts);

  return deltaCounts[1] * deltaCounts[3];
}

function test() {
  console.log(main());
}

test();
