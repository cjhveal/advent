const fs = require('fs');


function sum(items) {
  let total = 0;

  for (const item of items) {
    total += item;
  }

  return total;
}

class Grid {
  constructor(initialState) {
    const lines = initialState.trim().split('\n');

    this.grid = lines.map((line) => {
      return line.split('').map(char => char === '#' ? 1 : 0);
    });

    this.height = this.grid.length;
    this.width = this.grid[0].length;
  }

  neighbors(row, col) {
    const neighbors = [
      [row - 1, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1],
      [row - 1, col - 1],
      [row - 1, col + 1],
      [row + 1, col - 1],
      [row + 1, col + 1],
    ];

    const validNeighbors = neighbors.filter(([r, c]) => {
      const rowInBounds = 0 <= r && r < this.height;
      const colInBounds = 0 <= c && c < this.width;

      return rowInBounds && colInBounds;
    })

    return validNeighbors;
  }

  countLitNeighbors(row, col) {
    let total = 0;

    const neighbors = this.neighbors(row, col);

    const values = neighbors.map(([row, col]) => this.grid[row][col]);

    return sum(values);
  }

  shouldBeLit(isLit, neighborCount) {
    if (isLit) {
      return neighborCount === 2 || neighborCount === 3;
    } else {
      return neighborCount === 3;
    }
  }

  update() {
    const nextGrid = [];

    for (let row = 0; row < this.height; row++) {
      const nextItems = [];
      for (let col = 0; col < this.width; col++) {
        const item = this.grid[row][col];
        const count = this.countLitNeighbors(row, col);

        const nextItem = this.shouldBeLit(item, count);

        nextItems.push(Number(nextItem));
      }

      nextGrid.push(nextItems);
    }

    this.grid = nextGrid;
  }

  print() {
    for (let row = 0; row < this.height; row++) {
      const items = [];
      for (let col = 0; col < this.width; col++) {
        const item = this.grid[row][col];
        const glyph = item ? '#' : '.';

        items.push(glyph);
      }

      console.log(items.join(''))
    }
    console.log();
  }

  countLitTotal() {
    return sum(this.grid.map(row => sum(row)))
  }
}

function main(input, target) {
  const grid = new Grid(input);

  for (let i = 0; i < target; i++) {
    grid.update();
  }

  return grid.countLitTotal();
}

function runFromFile(inputFile, ...args) {
  const input = fs.readFileSync(inputFile, 'utf8');

  console.log(main(input, ...args));
}

function test() {
  runFromFile('input.txt', 100);
}

function example() {
  runFromFile('example.txt', 4);
}

//example();
test();