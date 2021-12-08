const fs = require('fs');

function range(from, to) {
  const step = from < to ? 1 : -1;
  return [...Array(Math.floor((to - from) / step) + 1)].map((_, i) => from + i * step);
}

class Line {
  constructor(rawLine) {
    const [pointA, pointB] = rawLine.split(' -> ').map(p => p.split(',').map(Number));
    console.log(rawLine, pointA, pointB)

    const [x1, y1] = pointA;
    const [x2, y2] = pointB;

    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
  }

  isHorizontal() {
    return (this.x1 === this.x2 || this.y1 === this.y2);
  }

  iteratePoints(fn) {
    if (this.x1 === this.x2) {
      for (const y of range(this.y1, this.y2)) {
        fn(`${this.x1},${y}`);
      }
    } else if (this.y1 === this.y2) {
      for (const x of range(this.x1, this.x2)) {
        fn(`${x},${this.y1}`);
      }
    } else {
      const xs = range(this.x1, this.x2);
      const ys = range(this.y1, this.y2);

      for (let i = 0; i < xs.length; i++) {
        fn(`${xs[i]},${ys[i]}`);
      }
    }
  }
}

function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');
  const lines = input.trim().split('\n').map(l => new Line(l));

  const pointMap = new Map();

  for (const l of lines) {
    l.iteratePoints((p) => {
      const prev = pointMap.get(p) || 0;

      pointMap.set(p, prev + 1);
    });
  }

  let total = 0;
  for (const coverage of pointMap.values()) {
    if (coverage > 1) {
      total += 1;
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
