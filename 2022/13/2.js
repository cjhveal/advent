const fs = require('fs');

const DEBUG = false;

const digitRegex = /\d/;
function isDigit(char) {
  return digitRegex.test(char);
}

function parseList(input, state = {pointer: 0}) {
  if (DEBUG) {
    console.log(input, state, 'len:', input.length);
  }
  const initial = input[state.pointer];
  if (initial !== '[') {
    throw new Error('list must begin with open brace');
  }

  state.pointer += 1;

  const result = [];

  while (state.pointer < input.length) {
    const char = input[state.pointer];

    if (DEBUG) {
      console.log('parseList -', char, state.pointer);
    }

    if (char === ']') {
      state.pointer += 1;
      return result;
    } else if (char === '[') {
      result.push(parseList(input, state));
      continue;
    } else if (isDigit(char)) {
      result.push(parseNumber(input, state));
      continue;
    } else if (char !== ',') {
      throw new Error('invalid character found');
    }

    state.pointer += 1;
  }

  throw new Error('no ending brace found');
}

function parseNumber(input, state = {pointer: 0}) {
  let digits = '';

  while (state.pointer < input.length) {
    const char = input[state.pointer];

    if (DEBUG) {
      console.log('parseNumber -', char, state.pointer, isDigit(char));
    }

    if (isDigit(char)) {
      digits += char;
    } else {
      break;
    }

    state.pointer += 1;
  }

  if (digits.length === 0) {
    throw new Error('empty number');
  }


  return parseInt(digits, 10);
}

function wrapArray(input) {
  return Array.isArray(input) ? input : [input]
}

function compare(left, right) {
  if (typeof left === 'number' && typeof right === 'number') {
    return compareNumbers(left, right);
  }

  return compareLists(wrapArray(left), wrapArray(right));
}

function compareLists(leftList, rightList) {
  let index = 0;
  while (true) {
    const hasLeft = (index < leftList.length);
    const hasRight = (index < rightList.length);

    if (!hasLeft && !hasRight) {
      return 0;
    } else if (!hasLeft) {
      return 1;
    } else if (!hasRight) {
      return -1;
    }

    const left = leftList[index];
    const right = rightList[index];

    if (DEBUG) {
      console.log(left, right);
    }

    const value = compare(left, right);

    if (value !== 0) {
      return value;
    }

    index += 1;
  }
}

function compareNumbers(left, right) {
  if (left === right) {
    return 0;
  } else if (left < right) {
    return 1;
  } else {
    return -1;
  }
}

function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const lines = input.split('\n\n').join('\n').split('\n');

  const inputLists = lines.map(line => parseList(line));

  const divider1 = [[2]];
  const divider2 = [[6]];

  const allLists = [...inputLists, divider1, divider2];

  allLists.sort((a, b) => {
    const value = compare(a, b);

    return -1 * value;
  });



  let index1 = -1;
  let index2 = -1;
  for (let i = 0; i < allLists.length; i++) {
    const item = allLists[i];

    if (DEBUG) {
      console.log(JSON.stringify(item));
    }
    if (item === divider1) {
      index1 = i + 1;
    } else if (item === divider2) {
      index2 = i + 1;
    }
  }

  if (index1 < 0 || index2 < 0) {
    throw new Error('cannot find dividers');
  }

  if (DEBUG) {
    console.log(index1, index2);
  }

  return index1 * index2;
}

function test() {
  console.log(main('./input.txt'));
}

function example() {
  console.log(main('./example.txt'));
}

function example2() {
  console.log(main('./example2.txt'));
}

function example3() {
  console.log(main('./example3.txt'));
}

function example4() {
  console.log(main('./example4.txt'));
}

function example5() {
  console.log(main('./example5.txt'));
}

test();
//example();
//example2();
