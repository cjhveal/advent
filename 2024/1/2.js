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


  const itemCount = {};
  for (const item of listTwo) {
    itemCount[item] ||= 0;
    itemCount[item] += 1;
  }

  let similarityScore = 0;
  for (const item of listOne) {
    similarityScore += item * (itemCount[item] || 0);
  }

  return similarityScore;
}

function test() {
  console.log(main('./input.txt'));
}

function testExample() {
  console.log(main('./example.txt'));
}

test();
//  testExample();
