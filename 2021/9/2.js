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

  return validNeighbors
}

function generateBasin(grid, col, row, basinSet = new Set()) {
  const neighbors = findValidNeighbors(grid, col, row);
  basinSet.add(`${col},${row}`);

  for (const neighbor of neighbors) {
    const [x, y] = neighbor;

    if (grid[y][x] !== 9 && !basinSet.has(`${x},${y}`)) {
      basinSet.add(`${x},${y}`);
      generateBasin(grid, x, y, basinSet);
    }
  }

  return basinSet;
}

function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const grid = input.trim().split('\n').map(line => {
    return line.trim().split('').map(Number)
  });


  const lowPoints = [];

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      const value = grid[row][col];
      const neighbors = findValidNeighbors(grid, col, row).map(([x, y]) => grid[y][x]);

      if (neighbors.every((n) => value < n)) {
        lowPoints.push([col, row]);
      }
    }
  }

  const basins = lowPoints.map(([x, y]) => {
    return generateBasin(grid, x, y);
  });

  const basinSizes = basins.map(basin => basin.size).sort((a, b) => b - a);

  return basinSizes[0] * basinSizes[1] * basinSizes[2];
}

function test() {
  console.log(main('input.txt'));
}

function example() {
  console.log(main('example.txt'));
}

//example();
test();
