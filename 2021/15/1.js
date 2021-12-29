const fs = require('fs');


class Grid {
  constructor(input) {
    this.grid = input.trim().split('\n').map((line) => {
      return line.trim().split('').map(Number);
    });

    this.distances = [];
    for (const row of this.grid) {
      const distanceRow = [];
      for (const item of row) {
        distanceRow.push(Infinity);
      }

      this.distances.push(distanceRow);
    }
    this.distances[0][0] = 0;

    this.unvisited = new Set();
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[0].length; col++) {
        this.unvisited.add(`${col},${row}`);
      }
    }
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

  findMinimumUnvisitedNode() {
    let min = Infinity;
    let minPoint = null;

    for (const rawPoint of this.unvisited.values()) {
      const point = rawPoint.split(',').map(Number);
      const [col, row] = point;
      const distance = this.distances[row][col];

      if (distance < min) {
        minPoint = point;
        min = distance;
      }
    }

    return minPoint;
  }

  isValidNeighbor(x, y) {
    return this.inBounds(x, y) && this.unvisited.has(`${x},${y}`);
  }

  findValidNeighbors(col, row) {
    const neighbors = [
      [col, row - 1],
      [col, row + 1],
      [col - 1, row],
      [col + 1, row],
    ];

    const validNeighbors = neighbors.filter(([x, y]) => this.isValidNeighbor(x, y));

    return validNeighbors
  }

  computeShortestPaths() {
    while (this.unvisited.size > 0) {
      const currentNode = this.findMinimumUnvisitedNode();
      const [col, row] = currentNode;

      this.unvisited.delete(`${col},${row}`);

      const neighbors = this.findValidNeighbors(col, row);

      for (const neighbor of neighbors) {
        const [x, y] = neighbor;
        const distance = this.distances[row][col] + this.grid[y][x];
        if (distance < this.distances[y][x]) {
          this.distances[y][x] = distance;
        }
      }
    }
  }

  targetDistance() {
    const height = this.distances.length;
    const width = this.distances[0].length;

    return this.distances[height - 1][width - 1];
  }
}

function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const graph = new Grid(input);

  graph.computeShortestPaths();

  return graph.targetDistance();


}

function test() {
  console.log(main('input.txt'));
}

function example() {
  console.log(main('example.txt'));
}

//example();
test();
