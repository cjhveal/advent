import {readFileSync} from 'fs';

const DEBUG = false;


const WHITESPACE_REGEXP = /\s+/;
function parseNumberList(rawList: string) {
  if(DEBUG) {
    console.log(rawList);
  }
  return rawList.trim().split(WHITESPACE_REGEXP).map(word => {
    if(DEBUG) {
      console.log(word, parseInt(word, 10));
    }

    return parseInt(word, 10);
  })
}

type RaceRecord = {
  time: number,
  distance: number,
};

function distanceTravelled(timePressingButton: number, totalTime: number): number {
  const timeTravelling = totalTime - timePressingButton;
  return timePressingButton * timeTravelling;
}

function main(filename: string): number {
  const input: string = readFileSync(filename, "utf8");

  const lines = input.trim().split('\n');

  const [times, distances] = lines.map(parseNumberList).map(list => {
    // cut off labels
    return list.slice(1);
  });

  const races = [];
  for (const [i, time] of times.entries()) {
    const distance = distances[i];
    races.push({time, distance});
  }

  let product = 1;
  for (const race of races) {
    const {time, distance} = race;

    let totalWays = 0;
    for (let i = 1; i < time; i++) {
      if (distanceTravelled(i, time) > distance) {
        totalWays += 1;
      }
    }

    product *= totalWays;
  }

  return product;
}

function test() {
  console.log(main("./input.txt"));
}

function testExample() {
  console.log(main("./example.txt"));
}

test();
//testExample();
