const fs = require('fs');

const DEBUG = false;

class Scanner {
  constructor(depth, range) {
    this.depth = depth;
    this.range = range;

    this.pos = 0;
    this.down = true;
  }

  increment() {
    let step = this.down ? 1 : -1;

    this.pos += step;

    if (this.pos >= this.range - 1) {
      this.down = false;
    } else if (this.pos <= 0) {
      this.down = true;
    }
  }

  check(floor) {
    return floor === this.depth && this.pos === 0;
  }

  severity() {
    return this.depth * this.range;
  }
}

function solve(input) {
  const floors = input.split('\n');

  const scanners = floors.map(floor => {
    const [depth, range] = floor.split(': ').map(Number);

    return new Scanner(depth, range);
  })

  
  const maxDepth = scanners[scanners.length - 1].depth;

  let delay = 0;

  let picosecond = -1;
  let position = -1;


  for (let i = 0; i <= maxDepth; i++) {
    picosecond += 1;
    position += 1;

    if (DEBUG) {
      console.log(position, scanners[3].pos, scanners[3].check(position))
    }

    for (const scanner of scanners) {
      if (scanner.check(position)) {

      }
    }

    for (const scanner of scanners) {
      scanner.increment();
    }
  }

  return total;
}

function main() {
  const input = fs.readFileSync('input.txt', 'utf8');

  return solve(input);
}

const TEST_INPUT = `0: 3
1: 2
4: 4
6: 4`;

//console.log(solve(TEST_INPUT));

console.log(main());
