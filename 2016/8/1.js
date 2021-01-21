const fs = require('fs');


const DEBUG=false;



const SCREEN_WIDTH = 50;
const SCREEN_HEIGHT = 6;


function mod(a, b) {
  return ((a % b) + b) % b;
}

class Screen {
  constructor(height, width) {
    this.height = height;
    this.width = width;

    this.buffer = this.blankBuffer();
  }

  blankBuffer() {
    return (
      Array(this.height)
        .fill(null)
        .map(x => Array(this.width).fill(false))
    );
  }

  cloneBuffer() {
    return this.buffer.map(row => [...row]);
  }

  normalizeCol(col) {
    return mod(col, this.width);
  }

  normalizeRow(row) {
    return mod(row, this.height);
  }

  rect({width, height}) {
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        this.set(row, col, true);
      }
    }
  }

  rotateCol({index, amount}) {
    const nextBuffer = this.cloneBuffer();

    for (let row = 0; row < this.height; row++) {
      const value = this.get(row - amount, index)

      this.set(row, index, value, nextBuffer);
    }

    this.buffer = nextBuffer;
  }

  rotateRow({index, amount}) {
    const nextBuffer = this.cloneBuffer();

    for (let col = 0; col < this.width; col++) {
      const value = this.get(index, col - amount)

      this.set(index, col, value, nextBuffer);
    }

    this.buffer = nextBuffer;
  }

  get(row, col, buffer = this.buffer) {
    const normalRow = this.normalizeRow(row);
    const normalCol = this.normalizeCol(col);
    return buffer[normalRow][normalCol];
  }

  set(row, col, value, buffer = this.buffer) {
    const normalRow = this.normalizeRow(row);
    const normalCol = this.normalizeCol(col);

    buffer[normalRow][normalCol] = value;
  }

  handle(instruction) {
    const { type, payload } = instruction;

    this[type].call(this, payload);
  }

  render() {
    let screenBuffer = '';
    for (const row of this.buffer) {
      for (const pixel of row) {
        screenBuffer += pixel ? '#' : '.';
      }
      screenBuffer += '\n';
    }

    return screenBuffer;
  }

  display() {
    console.log(this.render());
  }

  totalPixelsLit() {
    let total  = 0;

    for (const row of this.buffer) {
      for (const pixel of row) {
        total += Number(Boolean(pixel));
      }
    }

    return total;
  }
}


function parseInstruction(text) {
  const tokens = text.split(' ');

  if (tokens[0] === 'rect') {
    const [width, height] = tokens[1].split('x');
    return { type: 'rect', payload: {width, height} }
  } else if (tokens[0] === 'rotate') {
    const position = tokens[2];
    const amount = tokens[4];

    const [axis, index] = position.split('=');

    const type = axis === 'x' ? 'rotateCol' : 'rotateRow';

    return { type, payload: {index, amount} };
  }
}

function example() {
  const screen = new Screen(3, 7);

  screen.rect({height: 2, width: 3})
  screen.display();
  screen.rotateCol({index: 1, amount: 1});
  screen.display();
  screen.rotateRow({index: 0, amount: 4});
  screen.display();
}


function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const instructions = input.split('\n').map(parseInstruction);

  const screen = new Screen(SCREEN_HEIGHT, SCREEN_WIDTH);

  for (const instruction of instructions) {
    screen.handle(instruction);
  }

  return screen.totalPixelsLit();
}

function test() {
  console.log(main());
}

test();
