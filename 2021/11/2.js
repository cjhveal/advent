const fs = require('fs');


class Grid {
  constructor(input) {
    this.grid = input.trim().split('\n').map((line) => {
      return line.trim().split('').map(Number);
    });
  }

  inBounds(x, y) {
    if (x < 0 || y < 0) {
      return false;
    }
    if (y >= this.grid.length || x >= this.grid[0].length) {
      return false;
    }

    return true;
  }

  findValidNeighbors(col, row) {
    const neighbors = [
      [col, row - 1],
      [col, row + 1],
      [col - 1, row],
      [col + 1, row],
      [col - 1, row - 1],
      [col - 1, row + 1],
      [col + 1, row - 1],
      [col + 1, row + 1],
    ];

    const validNeighbors = neighbors.filter(([x, y]) => this.inBounds(x, y));

    return validNeighbors
  }

  iteratePoints(fn) {
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[0].length; col++) {
        fn(col, row);
      }
    }
  }

  increment() {
    this.iteratePoints((col, row) => {
      this.grid[col][row] += 1;
    });
  }

  flash(flashSet = new Set()) {
    let hasFlashed = false;
    this.iteratePoints((col, row) => {
      const serialPoint = `${col},${row}`;
      if (this.grid[col][row] > 9 && !flashSet.has(serialPoint)) {
        hasFlashed = true;
        flashSet.add(serialPoint);
        const neighbors = this.findValidNeighbors(col, row);
        for (const [x, y] of neighbors) {
          this.grid[x][y] += 1;
        }
      }
    });

    if (hasFlashed) {
      this.flash(flashSet);
    } else {
      this.resetEnergy();
    }

    return flashSet;
  }

  resetEnergy() {
    this.iteratePoints((col, row) => {
      if (this.grid[col][row] > 9) {
        this.grid[col][row] = 0;
      }
    });
  }

  size() {
    return this.grid.length * this.grid[0].length;
  }

}

const MAX_STEPS = 10000;
function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const grid = new Grid(input);

  for (let step = 1; step <= MAX_STEPS; step++) {
    grid.increment();
    const flashSet = grid.flash();


    if (flashSet.size === grid.size()) {
      return step;
    }
  }
}

function test() {
  console.log(main('input.txt'));
}

function example() {
  console.log(main('example.txt'));
}

//example();
test();
