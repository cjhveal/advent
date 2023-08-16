const fs = require('fs');

const EGG_COUNT = 7;


const DEBUG = true;

const TOGGLED_OPCODES = {
  'jnz': 'cpy',
  'cpy': 'jnz',
  'inc': 'dec',
  'dec': 'inc',
  'tgl': 'inc',
}

class Computer {
  constructor() {
    this.reset();

    this.operators = {
      'cpy': this.copy.bind(this),
      'inc': this.increment.bind(this),
      'dec': this.decrement.bind(this),
      'jnz': this.jumpNonZero.bind(this),
      'tgl': this.toggleInstruction.bind(this),
    }

    this.registerNameRegex = /[abcd]/i;
  }

  reset() {
    this.state = { a: EGG_COUNT, b: 0, c:0, d:0 };
    this.pointer = 0;
    this.instructions = [];
  }


  run(instructions) {
    this.instructions = instructions;
    this.toggleBuffer = [...new Array(instructions.length)].map(x => false);

    while (this.pointer < this.instructions.length) {
      const operation = this.instructions[this.pointer];
      const toggled = this.toggleBuffer[this.pointer];

      if (DEBUG) {
        console.log(operation, 'toggled:', toggled);
      }

      this.execute(operation, toggled);
    }
  }

  isRegister(arg) {
    return this.registerNameRegex.test(arg);
  }

  resolve(x) {
    return this.isRegister(x) ? this.state[x] : parseInt(x, 10);
  }

  resolveOperator(opcode, toggled) {
    if (!toggled) {
      return opcode;
    }

    return TOGGLED_OPCODES[opcode];
  }

  execute(operation, toggled) {
    const [rawOpcode, ...args] = operation.split(' ');

    const opcode = this.resolveOperator(rawOpcode, toggled);

    const operator = this.operators[opcode];

    operator(...args);
  }

  copy(x, y) {
    const value = this.resolve(x);

    if (this.isRegister(y)) {
      this.state[y] = value;
    }

    this.pointer += 1;
  }

  increment(x) {
    if (this.isRegister(x)) {
      this.state[x] += 1;
    }
    this.pointer += 1;
  }

  decrement(x) {
    if (this.isRegister(x)) {
      this.state[x] -= 1;
    }
    this.pointer += 1;
  }

  jumpNonZero(x, y) {
    if (DEBUG) {
      console.log(this.state);
    }
    const value = this.resolve(x);
    if (value !== 0) {
      const distance = this.resolve(y);
      this.pointer += distance;
    } else {
      this.pointer += 1;
    }
  }

  toggleInstruction(x) {
    const value = this.resolve(x);

    const target = this.pointer + value;

    this.toggleBuffer[target] = !this.toggleBuffer[target];

    this.pointer += 1;
  }

}


function main(input) {
  const machine = new Computer();

  const instructions = input.split('\n');

  machine.run(instructions);

  console.log(machine.state);
}

function run(input) {
  console.log(main(input));
}

function runFromFile(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  run(input);
}

function test() {
  runFromFile('input.txt');
}

function example1() {
  run(`cpy 41 a
inc a
inc a
dec a
jnz a 2
dec a`);
}

function example2() {
  runFromFile('example2.txt');
}

function example3() {
  runFromFile('example3.txt');
}

function example4() {
  runFromFile('example4.txt');
}

function example5() {
  runFromFile('example5.txt');
}

//example1();
test();
