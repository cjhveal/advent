const fs = require('fs');

function fullyContains(a1,b1,a2,b2) {
  return (a1 <= a2 && b1 >= b2)  || (a2 <= a1 && b2 >= b1);
}

function hasOverlap(a1,b1,a2,b2) {
  console.log(a1,b1,a2,b2);
  let result = a1 <= b2 && b1 >= a2;
  console.log(result);
  return result 
}

function parseRange(rawRange) {
  return rawRange.split('-').map(x => parseInt(x, 10))
}

function parsePair(rawPair) {
  return rawPair.split(',').map(parseRange);
}

function checkPair(pair) {
  const [first, second] = pair;

  return hasOverlap(...first, ...second);
}

function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const pairs = input.split('\n').map(parsePair);

  let total = 0;
  for (let pair of pairs) {
    if (checkPair(pair)) {
      total += 1;
    }
  }


  return total;
}

function test() {
  console.log(main('./input.txt'));
}

function example() {
  console.log(main('./example.txt'));
}

test();
//example();
