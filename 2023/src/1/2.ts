import * as fs from 'fs';

const DEBUG = true;

const DIGIT_REGEX = /(one|two|three|four|five|six|seven|eight|nine|\d)/g;


type DigitMap = {
  [key: string]: string
}

const DIGIT_MAP: DigitMap = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
}

function main(filename: string) {
  const input: string = fs.readFileSync(filename, 'utf8');

  const lines: string[] = input.trim().split('\n');

  let total = 0;
  for (const line of lines) {
    let firstNum: string;
    let lastNum: string;

    const allMatches = [];

    let match;
    while (match = DIGIT_REGEX.exec(line)) {
      allMatches.push(match[0]);
      // do not consume full match to allow overlapping patterns
      DIGIT_REGEX.lastIndex = match.index + 1;
    }

    if (allMatches.length === 0) {
      throw new Error('line had no numbers');
    }

    firstNum = allMatches[0];
    lastNum = allMatches[allMatches.length - 1];

    if(DEBUG) {
      console.log();
      console.log(line);
      console.log(firstNum, lastNum);
    }

    firstNum = DIGIT_MAP[firstNum] || firstNum;
    lastNum = DIGIT_MAP[lastNum] || lastNum;

    const rawValue = `${firstNum}${lastNum}`

    const value = parseInt(rawValue, 10);
    if(DEBUG) {
      console.log(value);
    }

    total += value;
  }

  return total;
}


function test() {
  console.log(main('./input.txt'));
}

function testExample() {
  console.log(main('./example2.txt'));
}

test();
//testExample();
