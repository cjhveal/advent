const fs = require('fs');

const DEBUG = false;


class RopeSimulator {
  constructor() {
    this.head = {x:0, y:0}
    this.tail = {x:0, y:0}

    this.tailTracker = new Set();

    this.directions = {
      U: this.up.bind(this),
      D: this.down.bind(this),
      L: this.left.bind(this),
      R: this.right.bind(this),
    }
  }

  up() {
    this.head = {
      x: this.head.x,
      y: this.head.y + 1,
    }

    this.resolveTail();
  }

  down() {
    this.head = {
      x: this.head.x,
      y: this.head.y - 1,
    }

    this.resolveTail();
  }

  left() {
    this.head = {
      x: this.head.x - 1,
      y: this.head.y,
    }

    this.resolveTail();
  }

  right() {
    this.head = {
      x: this.head.x + 1,
      y: this.head.y,
    }

    this.resolveTail();
  }

  resolveTail() {
    const deltaX = this.head.x - this.tail.x;
    const deltaY = this.head.y - this.tail.y;

    let moveX = 0;
    let moveY = 0;

    if (deltaX >= 2) {
      moveX = deltaX - 1;
      moveY = deltaY;
    } else if (deltaX <= -2) {
      moveX = deltaX + 1
      moveY = deltaY;
    }

    if (deltaY >= 2) {
      moveY = deltaY - 1;
      moveX = deltaX;
    } else if (deltaY <= -2) {
      moveY = deltaY + 1;
      moveX = deltaX;
    }

    if (DEBUG) {
      console.log(moveX, moveY);
    }

    this.tail = {
      x: this.tail.x + moveX,
      y: this.tail.y + moveY,
    };

    this.tailTracker.add(this.serializeTail());
  }

  serializeTail() {
    const {x, y} = this.tail;

    return `${x},${y}`;
  }

  run(direction, count) {
    const move = this.directions[direction];

    for (let i = 0; i < count; i++) {
      move();
    }
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
