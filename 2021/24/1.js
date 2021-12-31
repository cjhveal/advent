const fs = require('fs');

class ALU {
  constructor(instructions) {
    this.registers = { w: 0, x: 0, y: 0, z: 0 };

    this.instructions = instructions;

    this.operations = {

      inp: (a) => {
        this.registers[a] = this.nextInput();
      },
      add: (a, b) => {
        this.registers[a] += this.get(b);
      },
      mul: (a, b) => {
        this.registers[a] *= this.get(b);
      },
      div: (a, b) => {
        const dividend = this.get(a);
        const divisor = this.get(b);
        if (divisor === 0) {
          throw new Error('divide by 0')
        }

        this.registers[a] = Math.floor(dividend / divisor);
      },
      mod: (a, b) => {
        const dividend = this.get(a);
        const divisor = this.get(b);
        if (dividend < 0 || divisor <= 0) {
          throw new Error('mod with negative values');
        }
        this.registers[a] = dividend % divisor;
      },
      eql: (a, b) => {
        const lhs = this.get(a);
        const rhs = this.get(b);

        this.registers[a] = lhs === rhs ? 1 : 0;
      }
    }
  }

  reset() {
    this.registers = { w: 0, x: 0, y: 0, z: 0 };
  }

  get(value) {
    if (typeof value === 'number') {
      return value;
    } else {
      return this.registers[value];
    }
  }

  nextInput() {
    const [next] = this.inputValues.splice(0, 1);

    return next;
  }

  printState() {
    console.log(this.registers);
  }

  run(input) {
    this.reset();

    this.inputValues = [...input];

    for (const [opcode, inputA, inputB] of this.instructions) {
      const operator = this.operations[opcode];
      operator(inputA, inputB);
    }
  }
}

const hasNumberRegex = /\d/
function parseInstruction(line) {
  const tokens = line.trim().split(' ');
  const final = tokens[tokens.length - 1];

  if (hasNumberRegex.test(final)) {
    tokens[tokens.length - 1] = parseInt(final, 10);
  }

  return tokens;
}

function* combinationsWithReplacement(list, len) {
  function* generate(stack = []) {
    if (stack.length >= len) {
      yield stack;
    } else {
      for (const item of list) {
        stack.push(item);
        yield* generate(stack);
        stack.pop();
      }
    }
  }

  yield* generate();
}

const DIGITS = [9,8,7,6,5,4,3,2,1];
function main(input) {
  const instructions = input.trim().split('\n').map(parseInstruction);


  const alu = new ALU(instructions);
  alu.printState()

  for (const model of combinationsWithReplacement(DIGITS, 14)) {
    alu.run(model);
    const result = alu.get('z');
    if (result === 0) {
      return model;
    }
  }
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

function example() {
  runFromFile('example1.txt');
}

function example2() {
  runFromFile('example2.txt');
}

function example3() {
  runFromFile('example3.txt');
}

//example3();
test();
