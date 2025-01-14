const fs = require('fs');



const CENTER_LETTER = 'A';
const POSITIVE_LETTER = 'M';
const NEGATIVE_LETTER = 'S';

const directions = [
  // M on left
  [[-1,-1],[-1,1]],
  //M on top
  [[-1,-1], [1, -1]],
  //M on bottom
  [[-1,1],[1,1]],
  // M on right
  [[1,1], [1, -1]]
];


function getPoint(grid, x, y, xDist, yDist) {
  const currentX = x+xDist;
  const currentY = y+yDist;

  if (currentX < 0 || currentY < 0 || currentX >= grid[0].length || currentY >= grid.length) {
    return null;
  }

  const letter = grid[currentY][currentX];

  return letter;
}


function main(filename) {
  const input = fs.readFileSync(filename, 'utf8');

  const lines = input.split('\n');

  const grid = lines.map(line => line.split(''));


  let totalFound = 0;
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];

    for (let x = 0; x < row.length; x++) {

      const centerLetter = grid[y][x];


      if (centerLetter !== CENTER_LETTER) {
        continue;
      }

      loopDirections:for (const direction of directions) {
        for (const point of direction) {
          const [xOffset, yOffset] = point;
          const positiveLetter = getPoint(grid, x, y, xOffset, yOffset)
          const negativeLetter = getPoint(grid, x, y, -1*xOffset, -1*yOffset)

          if (positiveLetter !== POSITIVE_LETTER || negativeLetter !== NEGATIVE_LETTER) {
            continue loopDirections;
          }
        }

        // This direction has worked, none others can
        totalFound += 1;
        break loopDirections;
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
//testExample();
