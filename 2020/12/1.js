const fs = require('fs');


const DEBUG=true;


class Boat {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.heading = 90;
  }

  east(distance) {
    this.x += distance;
  }

  west(distance) {
    this.x -= distance;
  }

  north(distance) {
    this.y += distance;
  }

  south(distance) {
    this.y -= distance;
  }

  left(degrees) {
    this.turn(-1 * degrees);
  }

  right(degrees) {
    this.turn(degrees);
  }

  turn(degrees) {
    this.heading = ((this.heading + degrees) % 360 + 360) % 360;
  }

  forward(distance) {
    console.log('forward', this.heading, distance);
    if (this.heading === 0) {
      this.north(distance);
    } else if (this.heading === 90) {
      this.east(distance);
    } else if (this.heading === 180) {
      this.south(distance);
    } else if (this.heading === 270) {
      this.west(distance);
    }
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
