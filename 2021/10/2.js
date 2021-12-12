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
  '}': 3,
  ']': 2,
  '>': 4,
  ')': 1,
}

function sum(scores) {
  let total = 0;
  for (const score of scores) {
    total += score;
  }

  return total;
}

function scoreCompletion(completion) {
  let total = 0;

  for (let char of completion) {
    total *= 5;

    const charScore = BRACKET_SCORES[char];
    total += charScore;
  }

  return total;
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
    return { status: 'incomplete', stack }
  }
}

function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const lines = input.trim().split('\n').map((line) => {
    return line.trim().split('');
  });

  const incompletes = lines.map(processLine).filter(result => result.status === 'incomplete');

  const completions = incompletes.map(result => {
    const { stack } = result;
    return [...stack].reverse().map(b => MATCHING_BRACKETS[b])
  });

  const scores = completions.map(scoreCompletion)
  console.log(completions, scores);

  scores.sort((a, b) => b - a); 

  const midpoint = (scores.length - 1) / 2

  return scores[midpoint];
}

function test() {
  console.log(main('input.txt'));
}

function example() {
  console.log(main('example.txt'));
}

//example();
test();
