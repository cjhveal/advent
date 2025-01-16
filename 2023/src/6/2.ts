import {readFileSync} from 'fs';

const DEBUG = false;


const NONDIGIT_REGEXP = /\D+/g;

function parseRace(input: string) {
  const lines = input.trim().split('\n');

  return lines.map(line => {
    const onlyDigits = line.replace(NONDIGIT_REGEXP, '');

    return parseInt(onlyDigits, 10);
  });
}

type RaceRecord = {
  time: number,
  distance: number,
};

function distanceTravelled(timePressingButton: number, totalTime: number): number {
  const timeTravelling = Math.max(0, totalTime - timePressingButton)

  return timePressingButton * timeTravelling;
}

function binarySearch(lower: number, upper: number, fn: (n: number) => boolean, depth = 0): number {
  const index = Math.floor((upper + lower)/2);

  const currentValue = fn(index);
  const nextValue = fn(index + 1);

  if(DEBUG) {
    console.log(lower, upper, index, currentValue, nextValue);
  }

  if (currentValue && !nextValue) {
    return index;
  } else if (currentValue && nextValue) {
    return binarySearch(index + 1, upper, fn, depth+1);
  } else if (!currentValue && !nextValue) {
    return binarySearch(lower, index - 1, fn, depth+1);
  }
}

function main(filename: string): number {
  const input: string = readFileSync(filename, "utf8");

  const [time, distance] = parseRace(input);
  if(DEBUG) {
  console.log(distance, time);
  }


  let lowerBound = 0;
  for (let i = 1; i < time; i++) {
    if (distanceTravelled(i, time) > distance) {
      lowerBound = i;
      break;
    }
  }

  if (DEBUG) {
  console.log(lowerBound);
  }

  /*
  for (let i = time; i >= 0; i--) {
    if (distanceTravelled(i, time) < distance) {
      let upperBound = i;
      break;
    }
  }
  */

  const upperBound = binarySearch(lowerBound, time, (t) => (distanceTravelled(t, time) > distance));


  return upperBound - lowerBound + 1;
}

function test() {
  console.log(main("./input.txt"));
}

function testExample() {
  console.log(main("./example.txt"));
}

test();
//testExample();
