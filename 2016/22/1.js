const fs = require('fs');

const DEBUG = true;

const SPACE_REGEX = /\s+/g;
function splitOnWhitespace(str) {
  return str.split(SPACE_REGEX);
}

function convertSize(input) {
  const withoutUnit = input.slice(0, input.length - 1);

  return parseInt(withoutUnit, 10);
}

function parseNode(line) {
  const split = splitOnWhitespace(line);
  const [
    name,
    rawSize,
    rawUsed,
    rawAvail,
    percentUsed,
  ] = split;

  const [size, used, avail] = [rawSize, rawUsed, rawAvail].map(convertSize);

  return {
    name,
    size, used, avail,
    percentUsed
  };
}


function isViable(nodeA, nodeB) {
  return nodeA.used <= nodeB.avail;
}

function main(input) {
  const nodes = input.split('\n').slice(2).map(parseNode);

  let pairs = 0;
  for (let i = 0; i < input.length - 1; i++) {
    for (let j = i + 1; j < input.length; j++) {
      if (i === j) continue;

      const nodeA = input[i];
      const nodeB = input[j];

      if (isViable(nodeA, nodeB)) {
        pairs += 1;
      }
      if (isViable(nodeB, nodeA)) {
        pairs += 1;
      }
    }
  }

  return pairs;
}

function run(input) {
  console.log(main(input));
}

function runFromFile(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  run(input);
}

function test() {
  runFromFile('input.txt');
}

function example1() {
}

function example2() {
  runFromFile('example2.txt');
}

function example3() {
  runFromFile('example3.txt');
}

function example4() {
  runFromFile('example4.txt');
}

function example5() {
  runFromFile('example5.txt');
}

//example1();
test();
