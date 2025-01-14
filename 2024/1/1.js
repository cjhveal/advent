const fs = require('fs');


function parseLine(line) {
  const pair = line.split(/\s+/).map(x => parseInt(x, 10));

  return pair;
}

function main(filename) {
  const input = fs.readFileSync(filename, 'utf8');

  const lines = input.trim().split('\n');

  const listOne = [];
  const listTwo = [];

  for (const line of lines) {
    const [first, second] = parseLine(line);

    listOne.push(first);
    listTwo.push(second);
  }

  listOne.sort((a, b) => a - b);
  listTwo.sort((a, b) => a - b);

  let totalDistance = 0;
  for (let i = 0; i < listOne.length; i++) {
    //console.log(listOne[i], listTwo[i]);
    const delta = Math.abs(listOne[i] - listTwo[i]);
    totalDistance += delta;
  }

  return totalDistance;
}

function test() {
  console.log(main('./input.txt'));
}

function testExample() {
  console.log(main('./example.txt'));
}

test();
//  testExample();
