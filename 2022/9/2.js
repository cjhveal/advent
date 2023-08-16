const fs = require('fs');

const DEBUG = false;


class RopeSimulator {
  constructor() {
    this.segments = Array.from(Array(10), () => ({x:0, y:0}))

    this.tailTracker = new Set();

    this.directions = {
      U: this.up.bind(this),
      D: this.down.bind(this),
      L: this.left.bind(this),
      R: this.right.bind(this),
    }
  }

  up() {
    const head = this.segments[0];

    this.segments[0] = {
      x: head.x,
      y: head.y + 1,
    }

    this.resolveTail();
  }

  down() {
    const head = this.segments[0];

    this.segments[0] = {
      x: head.x,
      y: head.y - 1,
    }

    this.resolveTail();
  }

  left() {
    const head = this.segments[0];

    this.segments[0] = {
      x: head.x - 1,
      y: head.y,
    }

    this.resolveTail();
  }

  right() {
    const head = this.segments[0];

    this.segments[0] = {
      x: head.x + 1,
      y: head.y,
    }

    this.resolveTail();
  }

  resolveTail() {
    for (let i = 0; i < this.segments.length - 1; i++) {
      this.resolveSegments(i, i+1);
    }

    this.tailTracker.add(this.serializeTail());
  }


  resolveSegments(leadIndex, followIndex) {
    const lead = this.segments[leadIndex];
    const follow = this.segments[followIndex];

    const deltaX = lead.x - follow.x;
    const deltaY = lead.y - follow.y;

    let moveX = 0;
    let moveY = 0;

    if (deltaX >= 2) {
      moveX = deltaX - 1;
      moveY = Math.sign(deltaY);
    } else if (deltaX <= -2) {
      moveX = deltaX + 1
      moveY = Math.sign(deltaY);
    }

    if (deltaY >= 2) {
      moveY = deltaY - 1;
      moveX = Math.sign(deltaX);
    } else if (deltaY <= -2) {
      moveY = deltaY + 1;
      moveX = Math.sign(deltaX);
    }

    if (DEBUG) {
      console.log(moveX, moveY);
    }

    this.segments[followIndex] = {
      x: follow.x + moveX,
      y: follow.y + moveY,
    };

  }

  serializeTail() {
    const {x, y} = this.segments[this.segments.length-1];

    return `${x},${y}`;
  }

  run(direction, count) {
    const move = this.directions[direction];

    for (let i = 0; i < count; i++) {
      move();
    }
  }

  printTail(width, height) {
    let result = '';

    for (let y = height-1; y >= 0; y--) {
      for (let x = 0; x < width; x++) {
        let glyph = '.';
        for (let i = 0; i < this.segments.length; i++) {
          const segment = this.segments[i];
          if (segment.x === x && segment.y === y) {
            glyph = i === 0 ? 'H' : i;
            break;
          }
        }

        result += glyph;

      }
      result += '\n';
    }

    console.log(result);
  }
}

function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const instructions = input.split('\n').map(line => {
    const [direction, rawCount] = line.split(' ');

    const count = parseInt(rawCount, 10);

    return [direction, count];
  });

  const simulator = new RopeSimulator();

  for (const instruction of instructions) {
    simulator.run(...instruction);
  }

  //console.log(simulator.tailTracker);

  return simulator.tailTracker.size;
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
