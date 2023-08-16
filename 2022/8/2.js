const fs = require('fs');

const DEBUG = false;


class TreeGrid {
  constructor(grid) {
    this.grid = grid;

    this.rows = grid.length;
    this.cols = grid[0].length;
  }

  scenicScore(row, col) {
    const north = this.visibleFromNorth(row, col)
    const south =  this.visibleFromSouth(row, col)
    const east = this.visibleFromEast(row, col)
    const west = this.visibleFromWest(row, col);


    const score = north * south * east * west;
    if (DEBUG) {
      console.log(north,south,east,west, score);
    }

    return score;
  }

  visibleFromNorth(row, col) {
    if (row === 0) {
      return 0;
    }

    const height = this.grid[row][col];
    let total = 0;

    for (let i = row - 1; i >= 0; i--) {
      total += 1
      if (this.grid[i][col] >= height) {
        return total;
      }
    }

    return total;
  }

  visibleFromSouth(row, col) {
    if (row === this.rows-1) {
      return 0;
    }

    const height = this.grid[row][col];
    let total = 0;

    for (let i = row + 1; i < this.rows; i++) {
      total += 1;
      if (this.grid[i][col] >= height) {
        return total;
      }
    }

    return total;
  }

  visibleFromWest(row, col) {
    if (col === 0) {
      return 0;
    }

    const height = this.grid[row][col];
    let total = 0;


    for (let i = col - 1; i >= 0; i--) {
      total += 1;
      if (this.grid[row][i] >= height) {
        return total;
      }
    }

    return total;
  }

  visibleFromEast(row, col) {
    if (col === this.cols -1) {
      return 0;
    }

    const height = this.grid[row][col];
    let total = 0;

    for (let i = col + 1; i < this.cols; i++) {
      total += 1;
      if (this.grid[row][i] >= height) {
        return total;
      }
    }

    return total;
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

  let max = -Infinity;
  treeGrid.walk((row, col) => {
    const score = treeGrid.scenicScore(row, col)

    if (DEBUG) {
      console.log(row,col, treeGrid.grid[row][col], score);
    }

    if (score > max) {
      max = score;
    }
  })

  return max;
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
