import {readFileSync} from 'fs';

const DEBUG = true;

type Grid = string[][];

type PartCandidate = {
  id: number,
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

type Coordinates = [number, number]

function normalize(grid: Grid, r: number, c: number): Coordinates {
  if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length ) {
    return;
  }

  return [r, c];
}

function* getAdjacent(grid: Grid, r: number, c: number): Generator<Coordinates> {
  for (const direction of DIRECTIONS) {
    const [rDist, cDist] = direction;

    const coords = normalize(grid, r+rDist, c+cDist);

    if (coords) {
      yield coords;
    }
  }
}

function coordsToString(r: number, c: number) {
  return `${r},${c}`;
}

function storePart(map: Map<string, number>, r: number, c: number, id: number) {
  map.set(coordsToString(r, c), id);
}



function main(filename: string): number {
  const input: string = readFileSync(filename, "utf8");

  const rows = input.trim().split('\n').map(row => row.split(''));

  let currentPart: PartCandidate | null = null;
  let currentId = 0;
  const locationMap: Map<string, number> = new Map();
  const partsMap: Map<number, PartCandidate> = new Map();

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    for (let c = 0; c < row.length; c++) {
      const char = row[c];
      if (DIGIT_REGEXP.test(char)) {
        if (!currentPart) {
          currentPart = {
            id: currentId,
            n: -1,
            text: char,
            rowIndex: r,
            colIndex: c,
          }
          currentId += 1;
        } else {
          currentPart.text += char;
        }
        locationMap.set(coordsToString(r, c), currentPart.id);
      } else {
        if (currentPart) {
          currentPart.n = parseInt(currentPart.text, 10);
          partsMap.set(currentPart.id, currentPart);
          currentPart = null;
        }
      }
    }
  }


  let total = 0;
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    for (let c = 0; c < row.length; c++) {
      const char = row[c];

      if (char === '*') {
        const adjacentPartSet: Set<number> = new Set();

        for (const neighbor of getAdjacent(rows, r, c)) {
          const [neighborR, neighborC] = neighbor;

          const key = coordsToString(neighborR, neighborC);
          if (locationMap.has(key)) {
            const id = locationMap.get(key);

            adjacentPartSet.add(id);
          }
        }

        if (adjacentPartSet.size === 2) {
          let gearRatio = 1;
          for (const id of adjacentPartSet.values()) {
            const part = partsMap.get(id);
            if (part) {
              gearRatio *= part.n;
            }
          }
          total += gearRatio;
        }
      }
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
