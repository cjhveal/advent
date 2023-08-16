const fs = require('fs');

const DEBUG = false;


class VideoMachine {
  constructor() {
    this.x = 1;
    this.cycle = 0;

    this.totalStrength = 0;
  }

  clockTick() {
    this.cycle += 1;

    if ((this.cycle - 20) % 40 === 0) {
      this.totalStrength += this.signalStrength();
    }
  }

  execute(instruction, argument) {
    if (instruction === 'noop') {
      this.clockTick();
    } else if (instruction === 'addx') {
      this.clockTick();
      this.clockTick();
      this.x += argument;
    }

  }

  signalStrength() {
    const strength = this.cycle * this.x;
    if (DEBUG) {
      console.log(this.cycle, this.x, strength);
    }
    return strength;
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
  

  return machine.totalStrength;
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
