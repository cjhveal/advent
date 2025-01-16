import {readFileSync} from 'fs';

const DEBUG = false;

type Grid = string[][];

type PartCandidate = {
  n: number,
  text: string,
  rowIndex: number,
  colIndex: number,
}

const SYMBOL_REGEXP = /[^.A-Za-z0-9]/;
const DIGIT_REGEXP = /\d/;

const DIRECTIONS: Array<[number, number]> = [];
for (let i = -1; i <= 1; i++) {
  for (let j = -1; j <= 1; j++) {
    DIRECTIONS.push([i,j]);
  }
}

function getFromGrid(grid: Grid, r: number, c: number): string {
  if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length ) {
    return;
  }

  return grid[r][c];
}

function* getAdjacent(grid: Grid, r: number, c: number): Generator<string> {
  for (const direction of DIRECTIONS) {
    const [rDist, cDist] = direction;

    const value = getFromGrid(grid, r+rDist, c+cDist);

    yield value;
  }
}

function checkCandidate(grid: Grid, candidate: PartCandidate): boolean {
  for (let i = 0; i < candidate.text.length; i++) {
    const {rowIndex, colIndex} = candidate;
    for (const neighbor of getAdjacent(grid, rowIndex, colIndex+i)) {
      if (SYMBOL_REGEXP.test(neighbor)) {
        return true;
      }
    }
  }

  return false;
}

function main(filename: string): number {
  const input: string = readFileSync(filename, "utf8");

  const rows = input.trim().split('\n').map(row => row.split(''));

  const partsList: Array<PartCandidate> = [];
  let currentPart: PartCandidate | null = null;

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    for (let c = 0; c < row.length; c++) {
      const char = row[c];
      if (DIGIT_REGEXP.test(char)) {
        if (!currentPart) {
          currentPart = {
            n: -1,
            text: char,
            rowIndex: r,
            colIndex: c,
          }
        } else {
          currentPart.text += char;
        }
      } else {
        if (currentPart) {
          currentPart.n = parseInt(currentPart.text, 10);
          partsList.push(currentPart);
          currentPart = null;
        }
      }
    }
  }


  let total = 0;
  for (const candidate of partsList) {
    if (checkCandidate(rows, candidate)) {
      total += candidate.n;
    }
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
