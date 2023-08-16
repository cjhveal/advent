const fs = require('fs');

const DEBUG = false;


class TreeGrid {
  constructor(grid) {
    this.grid = grid;

    this.rows = grid.length;
    this.cols = grid[0].length;
  }

  isVisible(row, col) {
    return this.visibleFromNorth(row, col)
      || this.visibleFromSouth(row, col)
      || this.visibleFromEast(row, col)
      || this.visibleFromWest(row, col);

  }

  visibleFromNorth(row, col) {
    if (row === 0) {
      return true;
    }

    const height = this.grid[row][col];

    for (let i = row - 1; i >= 0; i--) {
      if (this.grid[i][col] >= height) {
        return false;
      }
    }

    return true;
  }

  visibleFromSouth(row, col) {
    if (row === this.rows-1) {
      return true;
    }

    const height = this.grid[row][col];

    for (let i = row + 1; i < this.rows; i++) {
      if (this.grid[i][col] >= height) {
        return false;
      }
    }

    return true;
  }

  visibleFromWest(row, col) {
    if (col === 0) {
      return true;
    }

    const height = this.grid[row][col];


    for (let i = col - 1; i >= 0; i--) {
      if (this.grid[row][i] >= height) {
        return false;
      }
    }

    return true;
  }

  visibleFromEast(row, col) {
    if (col === this.cols -1) {
      return true;
    }

    const height = this.grid[row][col];

    for (let i = col + 1; i < this.cols; i++) {
      if (this.grid[row][i] >= height) {
        return false;
      }
    }

    return true;
  }

  walk(fn) {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        fn(row, col);
      }
    }
  }
}

function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const rawGrid = input.split('\n').map(line => {
    return line.split('').map(n => parseInt(n, 10));
  });


  const treeGrid = new TreeGrid(rawGrid);

  let total = 0;
  treeGrid.walk((row, col) => {
    const visible = treeGrid.isVisible(row, col)

    if (DEBUG) {
      console.log(row,col, treeGrid.grid[row][col], visible);
    }

    if (visible) {
      total += 1;
    }
  })

  return total;
}

function test() {
  console.log(main('./input.txt'));
}

function example() {
  console.log(main('./example.txt'));
}

function example2() {
  console.log(main('./example2.txt'));
}

function example3() {
  console.log(main('./example3.txt'));
}

function example4() {
  console.log(main('./example4.txt'));
}

function example5() {
  console.log(main('./example5.txt'));
}

test();
//example();
//example2();
