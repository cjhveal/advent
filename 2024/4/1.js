const fs = require('fs');

const KEY_WORD = ["X", "M", "A", "S"];

const LETTER_MAP = {
  X: 0,
  M: 1,
  A: 2,
  S: 3,
};

const directions = [];
for (let yOff = -1; yOff <= 1; yOff++) {
  for (let xOff = -1; xOff <= 1; xOff++) {
    directions.push([xOff, yOff]);
  }
}



/**
 * Incorrect recursive approach, can make turns mid word.
function doSearch(grid, x, y, index) {
  if (index >= KEY_WORD.length) {
    return true;
  }

  if (y < 0 || y >= grid.length) {
    return false
  }

  if (x < 0 || x >= grid[0].length) {
    return false;
  }

  const letter = KEY_WORD[index];

  if (grid[y][x] === letter) {
    for (let yOff = -1; yOff <= 1; yOff++) {
      for (let xOff = -1; xOff <= 1; xOff++) {
        if (doSearch(grid, x+xOff, y+yOff, index+1)) {
          return true;
        }
      }
    }
  }

  return false;
}
*/


function main(filename) {
  const input = fs.readFileSync(filename, 'utf8');

  const lines = input.split('\n');

  const grid = lines.map(line => line.split(''));


  let totalFound = 0;
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];

    for (let x = 0; x < row.length; x++) {

      loopDirections:for (const direction of directions) {
        for (let distance = 0; distance <= KEY_WORD.length; distance++) {
          const [xDir, yDir] = direction;

          const xDist = xDir*distance;
          const yDist = yDir*distance;
          
          const currentX = x+xDist;
          const currentY = y+yDist;

          if (currentX < 0 || currentY < 0 || currentX >= row.length || currentY >= grid.length) {
            continue loopDirections;
          }

          const letter = grid[currentY][currentX];

          if (letter !== KEY_WORD[distance]) {
            continue loopDirections;
          }

          // We've reached the end of the key word and all letters matched
          if (distance === KEY_WORD.length - 1) {
            totalFound += 1;
          }
        }
      }

    }
  }

  return totalFound;
}

function test() {
  console.log(main('./input.txt'));
}

function testExample() {
  console.log(main('./example.txt'));
}

test();
//  testExample();
