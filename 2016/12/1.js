const fs = require('fs');


const DEBUG = false;

class Computer {
  constructor() {
    this.reset();

    this.operators = {
      'cpy': this.copy.bind(this),
      'inc': this.increment.bind(this),
      'dec': this.decrement.bind(this),
      'jnz': this.jumpNonZero.bind(this),
    }

    this.registerNameRegex = /[abcd]/i;
  }

  reset() {
    this.state = { a: 0, b: 0, c:0, d:0 };
    this.pointer = 0;
    this.instructions = [];
  }


  run(instructions) {
    this.instructions = instructions;

    while (this.pointer < this.instructions.length) {
      const operation = this.instructions[this.pointer];
      if (DEBUG) {
        console.log(operation);
      }

      this.execute(operation);
    }
  }

  isRegister(arg) {
    return this.registerNameRegex.test(arg);
  }

  resolve(x) {
    return this.isRegister(x) ? this.state[x] : parseInt(x, 10);
  }

  execute(operation) {
    const [opcode, ...args] = operation.split(' ');

    const operator = this.operators[opcode];

    operator(...args);
  }

  copy(x, y) {
    const value = this.resolve(x);

    this.state[y] = value;
    this.pointer += 1;
  }

  increment(x) {
    this.state[x] += 1;
    this.pointer += 1;
  }

  decrement(x) {
    this.state[x] -= 1;
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
  run(`cpy 1 a
cpy 1 b
cpy 26 d
jnz c 2
jnz 1 5
cpy 7 c
inc d
dec c
jnz c -2
cpy a c
inc a
dec b
jnz b -2
cpy c b
dec d
jnz d -6
cpy 13 c
cpy 14 d
inc a
dec d
jnz d -2
dec c
jnz c -5`);
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
