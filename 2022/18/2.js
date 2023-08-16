const fs = require('fs');

const DEBUG = false;

class LavaScanner {
  constructor(rawDroplets) {
    this.dropletSet = new Set(rawDroplets);
    this.droplets = rawDroplets.map(unmarshalPoint);;

  }

  totalSurfaceArea() {
    let totalArea = 0;
    for (let drop of this.droplets) {
      totalArea += this.surfaceArea(...drop);
    }

    return totalArea;
  }

  surfaceArea(x, y, z) {
    const neighbors = this.neighbors(x, y, z);

    let area = 6;

    for (let neighbor of neighbors) {
      if (this.dropletSet.has(marshalPoint(...neighbor))) {
        area -= 1;
      }
    }

    return area;
  }

  neighbors(x, y, z) {
    return [
      [x + 1, y, z],
      [x - 1, y, z],
      [x, y + 1, z],
      [x, y - 1, z],
      [x, y, z + 1],
      [x, y, z - 1],
    ];
  }
}

function marshalPoint(x, y, z) {
  return `${x},${y},${z}`;
}

function unmarshalPoint(point) {
  return point.split(',').map(n => parseInt(n, 10));
}

function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');


  const points = input.trim().split('\n');

  const scanner = new LavaScanner(points);


  return scanner.totalSurfaceArea();
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
