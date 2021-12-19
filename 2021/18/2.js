const fs = require('fs');


function copyArray(item) {
  if (Array.isArray(item)) {
    const left = copyArray(item[0]);
    const right = copyArray(item[1]);

    return [left, right];
  } else {
    return item;
  }
}

function add(a, b) {
  return [copyArray(a), copyArray(b)];
}

function search(fn, item, stack = []) {
  //console.log(item, stack.length);
  if (fn(item, stack)) {
    return stack;
  }

  if (Array.isArray(item)) {
    stack.push(0);
    const left = search(fn, item[0], stack);
    if (left) {
      return left;
    }

    stack.pop()
    stack.push(1);

    const right = search(fn, item[1], stack);
    if (right) {
      return right;
    }

    stack.pop();
  }
}

function stackToNumber(stack) {
  return parseInt(stack.join(''), 2);
}

function numberToStack(num, size) {
  const base = num.toString(2)
  const padded = base.padStart(size, '0');
  return padded.split('').map(n => Number(n))
}


function explode(number, stack) {
  const numericStack = stackToNumber(stack);

  let parent = number;
  for (let i = 0; i < stack.length - 1; i++) {
    parent = parent[stack[i]];
  }
  const stackFinal = stack[stack.length-1];

  const [leftValue, rightValue] = parent[stackFinal];


  if (!stack.every(s => s === 0)) {
    const leftStack = numberToStack(numericStack - 1, stack.length);

    let place = number;
    let final = leftStack[leftStack.length - 1];
    for (let i = 0; i < leftStack.length - 1; i++) {
      const nextPlace = place[leftStack[i]];

      if (!Array.isArray(nextPlace)) {
        final = leftStack[i]
        break;
      }

      place = nextPlace;
    }

    while (Array.isArray(place[final])) {
      place = place[final];
      final = 1
    }

    place[final] += leftValue;
  }

  if (!stack.every(s => s === 1)) {
    const rightStack = numberToStack(numericStack + 1, stack.length);

    let place = number;
    let final = rightStack[rightStack.length - 1];
    for (let i = 0; i < rightStack.length - 1; i++) {
      const nextPlace = place[rightStack[i]];

      if (!Array.isArray(nextPlace)) {
        final = rightStack[i]
        break;
      }

      place = nextPlace;
    }

    while (Array.isArray(place[final])) {
      place = place[final];
      final = 0
    }

    place[final] += rightValue;
  }

  parent[stackFinal] = 0

  return number;
}

function split(number, stack) {
  let place = number;
  for (let i = 0; i < stack.length - 1; i++) {
    place = place[stack[i]]
  }

  const final = stack[stack.length - 1];

  const half = place[final] / 2;

  place[final] = [Math.floor(half), Math.ceil(half)];

  return number;
}

const shouldExplode = (item, stack) => {
  return Array.isArray(item) && stack.length === 4;
}

const shouldSplit = (item, stack) => {
  return item >= 10
}

function reduce(number) {
  while (true) {
    const explodeStack = search(shouldExplode, number)

    if (explodeStack) {
      explode(number, explodeStack);
      continue;
    }

    const splitStack = search(shouldSplit, number);
    if (splitStack) {
      split(number, splitStack);
      continue;
    }

    if (!explodeStack && !splitStack) {
      break;
    }
  }

  return number;
}

function magnitude(number) {
  if (Array.isArray(number)) {
    const left = magnitude(number[0]);
    const right = magnitude(number[1]);

    return 3 * left + 2 * right;
  } else {
    return number;
  }
}

function main(input) {
  const lines = input.split('\n').map(l => JSON.parse(l))

  let maxMag = -Infinity;
  for (let i = 0; i < lines.length; i ++) {
    for (let j = 0; j < lines.length; j ++) {
      if (i !== j) {
        let number = add(lines[i], lines[j]);
        number = reduce(number);
        const mag = magnitude(number);

        if (mag > maxMag) {
          maxMag = mag;
        }
      }
    }
  }

  return maxMag;
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
  runFromFile('example1.txt');
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

//example5();
test();
