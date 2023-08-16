const fs = require('fs');

const DEBUG = false;


class Blacklist {
  constructor() {
    this.ranges = [];
  }

  addRange(range) {
    
  }
}
 
function parseBlacklistItem(line) {
  const [start, end] = line.trim().split('-').map(x => parseInt(x, 10));

  return [start, end];
}

function main(input) {
  const blockedIPs = input.split('\n').map(parseBlacklistItem);


}

function run(input) {
  console.log(main(input));
}

function runFromFile(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  run(input);
}

function test() {
  run(``);
}

function example1() {
  run(`5-8
0-2
4-7`);
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

example1();
//test();
