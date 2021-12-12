const fs = require('fs');


const MATCHING_BRACKETS = {
  '{': '}',
  '[': ']',
  '<': '>',
  '(': ')',
}

const OPENING_BRACKETS = Object.keys(MATCHING_BRACKETS);
const CLOSING_BRACKETS = Object.values(MATCHING_BRACKETS);

const BRACKET_SCORES = {
  '}': 1197,
  ']': 57,
  '>': 25137,
  ')': 3,
}

function processLine(line) {
  const stack = [];

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (OPENING_BRACKETS.includes(char)) {
      stack.push(char);
    } else if (CLOSING_BRACKETS.includes(char)) {
      if (MATCHING_BRACKETS[stack[stack.length-1]] === char) {
        stack.pop();
      } else {
        return { status: 'mismatch', char }
      }
    }
  }

  if (stack.length > 0) {
    return { status: 'incomplete' }
  }
}

function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const lines = input.trim().split('\n').map((line) => {
    return line.trim().split('');
  });

  const mismatches = lines.map(processLine).filter(result => result.status === 'mismatch');

  const scores = mismatches.map(result => BRACKET_SCORES[result.char])

  let total = 0;
  for (const score of scores) {
    total += score;
  }

  return total;
}

function test() {
  console.log(main('input.txt'));
}

function example() {
  console.log(main('example.txt'));
}

//example();
test();
