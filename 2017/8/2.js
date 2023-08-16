const fs = require('fs');

const DEBUG = true;

const COMPARATORS = {
  '<': (a, b) => a < b,
  '<=': (a, b) => a <= b,
  '>': (a, b) => a > b,
  '>=': (a, b) => a >= b,
  '==': (a, b) => a == b,
  '!=': (a, b) => a !== b,
}

const INSTRUCTION_REGEX = /(\S+) (inc|dec) (\S+) if (\S+) (\S+) (\S+)/
const NUMBER_REGEX = /^-?\d+$/;
class Machine {
  constructor() {
    this.registers = {};

    this.pointer = 0;

    this.maxValue = -1 * Infinity;
  }

  ensure(register) {
    if(!this.registers[register]) {
      this.registers[register] = 0;
    }
  }

  get(register) {
    this.ensure(register);
    return this.registers[register];
  }

  set(register, value) {
    this.ensure(register);
    this.registers[register] = value;

    if (value > this.maxValue) {
      this.maxValue = value;
    }
  }

  isRegister(value) {
    return !NUMBER_REGEX.test(value);
  }

  resolve(value) {
    return this.isRegister(value) ? this.get(value) : parseInt(value, 10);
  }

  shouldExecute(lhs, comparator, rhs) {
    const lhsValue = this.resolve(lhs);
    const rhsValue = this.resolve(rhs);
    const fn = COMPARATORS[comparator];

    return fn(lhsValue, rhsValue);
  }

  modify(target, opcode, rawValue) {
    let value = this.resolve(rawValue);

    if (opcode === 'dec') { 
      value *= -1;
    }

    const prevValue = this.get(target);

    const nextValue = prevValue + value;

    this.set(target, nextValue);
  }

  execute(instruction) {
    const [match, target, opcode, value, lhs, comparator, rhs] = instruction.match(INSTRUCTION_REGEX);

    if (this.shouldExecute(lhs, comparator, rhs)) {
      this.modify(target, opcode, value);
    }

    this.pointer += 1;
  }


  run(instructions) {
    while (this.pointer < instructions.length) {
      const instruction = instructions[this.pointer];
      if (DEBUG) {
        console.log(instruction);
      }
      this.execute(instruction)
    }
  }

  maxRegister() {
    let max = -1 * Infinity;
    let maxReg = null;
    for (const register of Object.keys(this.registers)) {
      const value = this.get(register);
      if (value > max) {
        max = value;
        maxReg = register;
      }
    }

    return max;
  }

}

function main(input) {
  const lines = input.split('\n');

  const machine = new Machine();

  machine.run(lines);

  return machine.maxValue;
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
  run(`b inc 5 if a > 1
a inc 1 if b < 5
c dec -10 if a >= 1
c inc -20 if c == 10`);
}

function example2() {
}
function example3() {
}
function example4() {
}
function example5() {

}

//example1();
test();
