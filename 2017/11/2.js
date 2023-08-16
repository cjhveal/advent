const fs = require('fs');

class HexGrid {
  constructor() {
    this.row = 0;
    this.col = 0;

    this.maxDistance = 0;

    this.directions = {
      'n': [2, 0],
      'ne': [1, -1],
      'nw': [1, 1],
      's': [-2, 0],
      'se': [-1, -1],
      'sw': [-1, 1],
    };
  }

  move(direction) {
    const [rowDelta, colDelta] = this.directions[direction];

    this.row += rowDelta;
    this.col += colDelta;

    this.recordMaxDistance();
  }

  recordMaxDistance() {
    const dist = this.distance();

    if (dist > this.maxDistance) {
      this.maxDistance = dist;
    }
  }

  distance() {
    const dcol = Math.abs(this.col);
    const drow = Math.abs(this.row);

    return dcol + Math.max(0, (drow-dcol)/2)
  }
}

function main(input) {
  const moves = input.split(',');

  const grid = new HexGrid();

  for (const direction of moves) {
    grid.move(direction);
  }

  return grid.maxDistance;
}

function run(input) {
  console.log(main(input));
}

function runFromFile(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  run(input);
}

function test() {
  runFromFile('input.txt');
}

function example1() {
  run(`ne,ne,ne`);
}
function example2() {
  run(`ne,ne,sw,sw`);
}
function example3() {
  run(`ne,ne,s,s`);
}
function example4() {
  run(`se,sw,se,sw,sw`);
}
function example5() {

}

//example4();
test();
