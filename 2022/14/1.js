const fs = require('fs');

const DEBUG = true;

const SAND_ORIGIN = [500, 0];

class SandSimulator {
  constructor(walls) {
    this.minX = Infinity;
    this.maxX = -Infinity;
    this.minY = Infinity;
    this.maxY = -Infinity;

    for (const wall of walls) {
        for (const point of wall) {
          const [x, y] = point;

          if (x < this.minX) {
            this.minX = x;
          } else if (x > this.maxX) {
            this.maxX = x;
          } else if (y < this.minY) {
            this.minY = y;
          } else if (y > this.maxY) {
            this.maxY = y;
          }
        }
    }

    this.grid = Array.from(Array(this.maxY + 1), () => {
      return Array(this.maxX + 1).fill('.');
    });


    if (DEBUG) {
      console.log(this.minX, this.maxX, this.minY, this.maxY);
    }

    for (const wall of walls) {
      this.drawWall(wall);
    }

    this.sandCounter = 0;

    this.origin = [...SAND_ORIGIN];

  }


  drawWall(wall) {
    for (let i = 0; i < wall.length - 1; i++) {
      const pointA = wall[i];
      const pointB = wall[i+1];

      this.drawWallSegment(pointA, pointB);
    }
  }

  drawWallSegment(pointA, pointB) {
    const [ax, ay] = pointA;
    const [bx, by] = pointB;

    if (ay === by) {
      if (ax <= bx) {
        this.drawRight(pointA, pointB, '#');
      } else {
        this.drawLeft(pointA, pointB, '#');
      }
    } else if (ax === bx) {
      if (ay <= by) {
        this.drawDown(pointA, pointB, '#');
      } else {
        this.drawUp(pointA, pointB, '#');
      }
    }
  }

  drawRight(pointA, pointB, glyph) {
    const [ax, ay] = pointA;
    const [bx, by] = pointB;
    for (let i = ax; i <= bx; i++) {

      this.grid[ay][i] = glyph;

    }
  }

  drawLeft(pointA, pointB, glyph) {
    this.drawRight(pointB, pointA, glyph);
  }


  drawDown(pointA, pointB, glyph) {
    const [ax, ay] = pointA;
    const [bx, by] = pointB;
    for (let i = ay; i <= by; i++) {
      this.grid[i][ax] = glyph;
    }
  }

  drawUp(pointA, pointB, glyph) {
    this.drawDown(pointB, pointA, glyph);
  }


  dropSand() {
    this.sandCounter += 1;

    let [x, y] = this.origin;

    while (y < this.maxY && x >= this.minX && x <= this.maxX) {

      if (this.canPass(x, y+1)) {
        y += 1;
      } else if (this.canPass(x-1, y+1)) {
        x -= 1;
        y += 1;
      } else if (this.canPass(x+1, y+1)) {
        x += 1;
        y += 1;
      } else {
        this.grid[y][x] = 'o';
        return true;
      }
    }

    return false;
  }

  canPass(x, y) {
      const glyph = this.grid[y][x];

    return (glyph === '.');
  }

  simulate() {
    while (this.dropSand()) {
      if (DEBUG) {
        console.log(this.printGrid());
      }
    }
  }

  printGrid() {
    let result = '';
    for (let y = 0; y < this.maxY + 1; y++) {
      for (let x = this.minX - 1; x < this.maxX + 1; x++) {
        result += this.grid[y][x];
      }
      result += '\n';
    }

    return result;
  }

}

function marshalPoint([x, y]) {
  return `${x},${y}`;
}

function unmarshalPoint(rawPoint) {
  return rawPoint.split(',').map(n => parseInt(n, 10));
}

function parseWall(line) {
  const rawPoints = line.split(' -> ');

  return rawPoints.map(unmarshalPoint);
}

function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const walls = input.split('\n').map(parseWall);


  const simulator = new SandSimulator(walls);

  simulator.simulate();

  return simulator.sandCounter - 1;
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
