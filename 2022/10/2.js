const fs = require('fs');

const DEBUG = false;


class VideoMachine {
  constructor() {
    this.x = 1;
    this.cycle = 0;

    this.screen = new Screen(6, 40);
  }

  clockTick() {
    this.cycle += 1;

    this.screen.clockTick(this.x);
  }

  execute(instruction, argument) {
    if(DEBUG) {
      console.log(instruction, argument);
    }
    if (instruction === 'noop') {
      this.clockTick();
    } else if (instruction === 'addx') {
      this.clockTick();
      this.clockTick();
      this.x += argument;
    }
  }

  print() {
    return this.screen.print();
  }

}

class Screen {
  constructor(height, width) {
    this.grid = Array.from(Array(height), () => Array(width).fill(''));

    this.cycle = 0;
  }

  clockTick(sprite) {
    const col = this.cycle % 40;
    const row = Math.floor(this.cycle / 40)

    const delta = Math.abs(col - sprite);

    const glyph = delta <= 1 ? '#' : '.';

    if(DEBUG) {
      console.log(col, row, glyph);
    }

    this.grid[row][col] = glyph;

    this.cycle += 1;
  }

  print() {
    const result = this.grid.map(line => line.join('')).join('\n');

    return result;
  }
}

function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const commands = input.split('\n').map(line => {
    if (line === 'noop') {
      return [line];
    }

    const [instruction, rawArgument] = line.split(' ');

    const argument = parseInt(rawArgument, 10);

    return [instruction, argument];
  });

  const machine = new VideoMachine();

  for (const command of commands) {
    machine.execute(...command);
  }

  

  return machine.print();
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
