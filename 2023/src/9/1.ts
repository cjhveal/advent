import {readFileSync} from 'fs';

const DEBUG = false;


const WHITESPACE_REGEXP = /\s+/;
function parseNumberList(rawList: string): Array<number> {
  const words = rawList.trim().split(WHITESPACE_REGEXP);

  return words.map(word => parseInt(word, 10));
}

function isAllZero(list: Array<number>) {
  return list.every(n => n === 0);
}

function extrapolateSequence(baseSequence: Array<number>): number {
  const finalNumbers: number[] = [];

  let currentSequence: number[] = baseSequence;
  let deltaSequence: number[] = [];

  while (!isAllZero(currentSequence)) {
    for (let i = 0; i < currentSequence.length - 1; i++) {
      const delta = currentSequence[i + 1] - currentSequence[i];
      deltaSequence.push(delta)
    }

    finalNumbers.push(currentSequence[currentSequence.length - 1]);

    currentSequence = deltaSequence;
    deltaSequence = [];
  }

  finalNumbers.reverse();

  let extrapolatedNumber = 0;
  for (const previous of finalNumbers) {
    extrapolatedNumber += previous;
  }

  return extrapolatedNumber;
}

function main(filename: string): number {
  const input: string = readFileSync(filename, "utf8");

  const inputSequences = input.trim().split('\n').map(parseNumberList);

  let total = 0;
  for (const sequence of inputSequences) {
    const nextNumber = extrapolateSequence(sequence);

    total += nextNumber;
  }

  return total;
}

function test() {
  console.log(main("./input.txt"));
}

function testExample() {
  console.log(main("./example.txt"));
}

test();
//testExample();
