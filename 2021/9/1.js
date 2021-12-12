const fs = require('fs');

function inBounds(grid, x, y) {
  if (x < 0 || y < 0) {
    return false;
  }
  if (y >= grid.length || x >= grid[0].length) {
    return false;
  }

  return true;
}

function findValidNeighbors(grid, col, row) {
  const neighbors = [
    [col, row - 1],
    [col, row + 1],
    [col - 1, row],
    [col + 1, row],
  ];

  const validNeighbors = neighbors.filter(([x, y]) => inBounds(grid, x, y));

  return validNeighbors.map(([x, y]) => grid[y][x]);
}

function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const grid = input.trim().split('\n').map(line => {
    return line.trim().split('').map(Number)
  });

  let total = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      const value = grid[row][col];
      const neighbors = findValidNeighbors(grid, col, row);

      if (neighbors.every((n) => value < n)) {
        total += value + 1;
      }
    }
  }

  return total;
}

function test() {
  console.log(main('input.txt'));
}

function example() {
  console.log(main('example.txt'));
}

//example();
test();
