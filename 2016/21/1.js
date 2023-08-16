const fs = require('fs');

const DEBUG = true;

const DEFAULT_PASSWORD = 'abcdefgh';

function toInt(n) {
  return parseInt(n, 10);
}

function swapPosition(input, inputX, inputY) {
  const x = toInt(inputX);
  const y = toInt(inputY);
  const a = input[x];
  const b = input[y];

  if (x < y) {
    return input.slice(0,x) + b + input.slice(x + 1, y) + a + input.slice(y + 1);
  } else {
    return input.slice(0,y) + a + input.slice(y + 1, x) + b + input.slice(x + 1);
  }

}

function swapLetters(input, a, b) {
  let result = ''

  for (let i = 0; i < input.length; i++) {
    if (input[i] === a){
      result += b;
    } else if (input[i] === b) {
      result += a;
    } else {
      result += input[i];
    }
  }

  return result;
}


function rotateLeft(input, steps) {
  const n = steps % input.length;

  return input.slice(n) + input.slice(0, n);
}

function rotateRight(input, steps) {
  const n = steps % input.length;
  return rotateLeft(input, input.length - n);
}

function rotate(input, direction, inputSteps) {
  const steps = toInt(inputSteps);
  if (direction === 'left') {
    return rotateLeft(input, steps);
  } else if (direction ==='right') {
    return rotateRight(input, steps);
  }
}

function rotateOnLetter(input, letter) {
  const letterIndex = input.indexOf(letter);

  const fourFactor = letterIndex >= 4 ? 1 : 0;

  const steps = 1 + letterIndex + fourFactor;

  return rotateRight(input, steps);
}

function reversePositions(input, inputX, inputY) {
  const x = toInt(inputX);
  const y = toInt(inputY);

  const target = input.slice(x, y+1);
  const reversed = [...target].reverse().join('')

  return input.slice(0, x) + reversed + input.slice(y+1);
}


function movePosition(input, inputX, inputY) {
  const x = toInt(inputX);
  const y = toInt(inputY);

  const letter = input[x];

  if (x < y) {
    return input.slice(0,x) + input.slice(x+1, y+1) + letter + input.slice(y+1);
  } else {
    return input.slice(0,y) + letter + input.slice(y, x) + input.slice(x+1);
  }
}


const OPERATIONS = [
  { 
    regex: /swap position (\S+) with position (\S+)/,
    operator: swapPosition,
  },
  { 
    regex: /swap letter (\S+) with letter (\S+)/,
    operator: swapLetters,
  },
  { 
    regex: /rotate (left|right) (\S+) steps?/,
    operator: rotate,
  },
  { 
    regex: /rotate based on position of letter (\S+)/,
    operator: rotateOnLetter,
  },
  {
    regex: /reverse positions (\S+) through (\S+)/,
    operator: reversePositions,
  },
  {
    regex: /move position (\S+) to position (\S+)/,
    operator: movePosition,
  },
];

function parseInstruction(input) {
  for (const operation of OPERATIONS) {
    const match = input.match(operation.regex);

    if (match) {
      return {
        match: match.slice(1),
        operator: operation.operator,
      };
    }
  }

  if (DEBUG) {
    console.error('cannot parse the following operation:')
    console.error(input);
  }
}



function main(input) {
  const instructions = input.split('\n')

  let result = DEFAULT_PASSWORD;
  for (const instruction of instructions) {
    const {match, operator} = parseInstruction(instruction);

    if (DEBUG) {
      console.log(result);
      console.log(instruction, match);
    }
    result = operator(result, ...match);
    if (DEBUG) {
      console.log(result);
      console.log('');
    }
  }

  return result;
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
