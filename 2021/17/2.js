const fs = require('fs');

const TARGET_REGEX = /target area: (.+)/;

function parseTargetArea(rawTarget) {
  const match = rawTarget.match(TARGET_REGEX);

  if (!match) {
    throw new Error('error parsing target area', rawTarget);
  }

  const [fullMatch, target] = match;

  const ranges = target.trim().split(', ').map(rawRange => {
    // remove axis and split range
    return rawRange.slice(2).split('..').map(n => parseInt(n, 10))
  });

  return ranges;
}

function searchSpace(target) {
  const [xTarget, yTarget] = target;


  const [x1, x2] = xTarget;
  const [y2, y1] = yTarget;

  const xMin = minimumToReach(x1) + 1;
  const xMax = x2;

  const yMin = y2;
  const yMax = (-1 * y2) - 1;

  return [
    [xMin, xMax],
    [yMin, yMax],
  ];
}

// quadratic equation from sum = n(n+1)/2
function minimumToReach(sigma) {
  return Math.floor((Math.sqrt(8 * sigma + 1) - 1) / 2)
}


class Probe {
  constructor(vx, vy) {
    this.vx = vx;
    this.vy = vy;
    this.px = 0;
    this.py = 0;
  }

  update() {
    this.px += this.vx;
    this.py += this.vy;

    this.vx = Math.max(0, this.vx - 1);
    this.vy = this.vy - 1;
  }

  isInTarget(target) {
    const [xTarget, yTarget] = target;

    const [x1, x2] = xTarget;
    const [y2, y1] = yTarget;

    const inXBound = x1 <= this.px && this.px <= x2;
    const inYBound = y2 <= this.py && this.py <= y1;

    return inXBound && inYBound;
  }

  isPastTarget(target) {
    const [xTarget, yTarget] = target;

    const [x1, x2] = xTarget;
    const [y2, y1] = yTarget;

    return this.py < y2 || this.px > x2
  }
}

function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const target = parseTargetArea(input);
  const search = searchSpace(target);

  const [xRange, yRange] = search;

  const [x1, x2] = xRange;
  const [y1, y2] = yRange;

  let total = 0;
  for (let x = x1; x <= x2; x++) {
    for (let y = y1; y <= y2; y++) {
      const probe = new Probe(x, y);

      while(!probe.isPastTarget(target)) {
        probe.update();
        if (probe.isInTarget(target)) {
          total += 1;
          break;
        }
      }
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
