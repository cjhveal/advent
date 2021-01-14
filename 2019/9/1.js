const fs = require('fs');

const DEBUG = true;

class IntCodeComputer {
  constructor(program) {
    this.pointer = 0;
    this.relativeBase = 0;
    this.memory = Array(2**16 + 1).fill(0);

    for (const [index, word] of program.entries()) {
      this.memory[index] = word;
    }

    this.inputs =[];
    this.outputs = [];

    this.operations = {
      '01': (a, b) => a + b,
      '02': (a, b) => a * b,
      '07': (a, b) => a < b ? 1 : 0,
      '08': (a, b) => a === b ? 1 : 0,
    }

    this.halted = false;
  }

  execute() {
    while(this.memory[this.pointer] !== 99) {
      const stepValue = this.step();
      if (stepValue && stepValue.interrupt) {
        return this.outputs;
      }
    }

    return this.terminate();
  }

  parseOpcode() {
    const value = this.memory[this.pointer];

    const chars = String(value).padStart(5, '0');

    const third = chars[0];
    const second = chars[1];
    const first = chars[2];
    const opcode = chars.slice(3);

    const modes = { first, second, third };

    return {
      opcode, modes, fullOpcode: chars,
    }
  }

  step() {
    const {opcode, modes, fullOpcode} = this.parseOpcode();

    if (opcode === '03') {
      const location = this.getParam(1, '1')

      if (this.inputs.length === 0) {
        return { interrupt: true };
      }

      const inputValue = this.inputs.pop();

      this.setValue(location, inputValue, modes.first);

      this.pointer += 2;
    } else if (opcode === '04') {
      const value = this.getParam(1, modes.first);

      this.outputs.push(value);

      this.pointer += 2;
    } else if (opcode === '01' || opcode === '02' || opcode === '07' || opcode === '08') {
      const operation = this.operations[opcode];

      const input1 = this.getParam(1, modes.first);
      const input2 = this.getParam(2, modes.second)
      const output = this.getParam(3, '1')

      if (DEBUG) {
        console.log(this.pointer, fullOpcode, input1, input2, output);
      }

      const value = operation(input1, input2);

      this.setValue(output, value, modes.third);

      this.pointer += 4;
    } else if (opcode === '05' || opcode === '06') {
      const value = this.getParam(1, modes.first);
      const nextPointer = this.getParam(2, modes.second);

      if (DEBUG) {
        console.log(this.pointer, fullOpcode, value, nextPointer);
      }


      if (opcode === '05' && value !== 0) {
        this.pointer = nextPointer;
      } else if (opcode === '06' && value === 0) {
        this.pointer = nextPointer;
      } else {
        this.pointer += 3;
      }
    } else if (opcode === '09') {
      const value = this.getParam(1, modes.first);
      
      this.relativeBase += value;

      this.pointer += 2;

    } else if (opcode === '99') {
      throw new Error('should have halted');
    } else {
      if (DEBUG) {
        console.log(this.pointer, this.memory[this.pointer], fullOpcode)
      }
      throw new Error(`unknown opcode ${opcode}`);
    }
  }

  setValue(param, value, mode) {
    const address = mode === '0' ? param : this.relativeBase + param;

    this.memory[address] = value;
  }

  getParam(index, mode) {
    const value = this.memory[this.pointer + index];

    return this.getValue(value, mode);
  }

  getValue(value, mode) {
    if (mode === '1') {
      return value;
    } else if (mode === '2') {
      const address = this.relativeBase + value;
      return this.memory[address];
    } else {
      return this.memory[value];
    }
  }

  enqueueInput(inputs) {
    this.inputs = [...inputs.reverse(), ...this.inputs];
  }

  clearOutput() {
    this.outputs = [];
  }

  terminate() {
    this.halted = true;

    return this.outputs;
  }

}
function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const initialProgram = input.split(',').map(Number);

  const computer = new IntCodeComputer(initialProgram);

  computer.enqueueInput([2]);

  const [output] = computer.execute();

  return output;
}

function test() {
  console.log(main());
}

test();
