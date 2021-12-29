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

// to ensure original arrays are not modified during addition
// we performa a deep copy of the arrays
function add(a, b) {
  return [copyArray(a), copyArray(b)];
}

// finds the first item that satisfies the predicate `fn`
// and returns a list of indexes that identify the location of the item
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


/*
 * Stack is a list of 0 and 1 representing left and right
 * if taken as a binary number, then adjacent numbers also
 * represent adjacent leaves of the tree
 */
function explode(number, stack) {
  // represent the stack identifying our target as a number
  const numericStack = stackToNumber(stack);

  // find the parent of our target by iterating through the stack
  // we always stop one level from the end to allow us to mutate items from the parent
  let parent = number;
  for (let i = 0; i < stack.length - 1; i++) {
    parent = parent[stack[i]];
  }
  const stackFinal = stack[stack.length-1];

  const [leftValue, rightValue] = parent[stackFinal];


  // a stack of all 0 represents the leftmost item
  // thus there will be no items to explode into to the the left
  if (!stack.every(s => s === 0)) {
    const leftStack = numberToStack(numericStack - 1, stack.length);

    let place = number;
    let final = leftStack[leftStack.length - 1];
    for (let i = 0; i < leftStack.length - 1; i++) {
      const nextPlace = place[leftStack[i]];

      // if we've reached a leaf node already, don't continue iterating the stack
      if (!Array.isArray(nextPlace)) {
        final = leftStack[i]
        break;
      }

      place = nextPlace;
    }

    // if we haven't reached the end yet, continue iterating right to minimize distance to item
    while (Array.isArray(place[final])) {
      place = place[final];
      final = 1
    }

    place[final] += leftValue;
  }

  // likewise a stack of all 1s represents the rightmost item
  // and thus there will be no items to explode into on the right of it
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

    // if we haven't reached a leaf node yet continue iterating left
    while (Array.isArray(place[final])) {
      place = place[final];
      final = 0
    }

    place[final] += rightValue;
  }

  // replace the exploded item with 0
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

// to reduce, perform all valid explodes then all valid splits
// including any explodes that result from these operations
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
