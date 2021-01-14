const fs = require('fs');


const DEBUG=true;


class Boat {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.heading = 90;

    this.wx = 10;
    this.wy = 1;
  }

  east(distance) {
    this.wx += distance;
  }

  west(distance) {
    this.wx -= distance;
  }

  north(distance) {
    this.wy += distance;
  }

  south(distance) {
    this.wy -= distance;
  }

  left(degrees) {
    const turns = degrees / 90;

    for (let i = 0; i < turns; i++) {
      this.counterclockwise();
    }
  }

  right(degrees) {
    const turns = degrees / 90;

    for (let i = 0; i < turns; i++) {
      this.clockwise();
    }
  }

  clockwise() {
    const prevWx = this.wx;
    const prevWy = this.wy;

    this.wy = -prevWx;
    this.wx = prevWy;
  }

  counterclockwise() {
    const prevWx = this.wx;
    const prevWy = this.wy;

    this.wy = prevWx;
    this.wx = -prevWy;
  }

  forward(distance) {
    this.x += this.wx * distance;
    this.y += this.wy * distance;
  }

  handle(operation) {
    const [opcode, value] = operation;

    if (opcode === 'N') {
      return this.north(value);
    } else if (opcode === 'E') {
      return this.east(value);
    } else if (opcode === 'S') {
      return this.south(value);
    } else if (opcode === 'W') {
      return this.west(value);
    } else if (opcode === 'R') {
      return this.right(value);
    } else if (opcode === 'L') {
      return this.left(value);
    } else if (opcode === 'F') {
      return this.forward(value);
    }
  }

  distance() {
    return Math.abs(this.x) + Math.abs(this.y);
  }
}

function parseOperation(rawText) {
  const opcode = rawText[0];
  const value = Number(rawText.slice(1).trim());

  return [opcode, value];
}


function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');
  const lines = input.split('\n');
  const operations = lines.map(parseOperation);


  const boat = new Boat();
  for (const operation of operations) {
    boat.handle(operation);
  }

  return boat.distance();
}

function test() {
  console.log(main());
}

test();
