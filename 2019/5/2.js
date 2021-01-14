const fs = require('fs');


class IntCodeComputer {
  constructor(program) {
    this.pointer = 0;
    this.memory = [...program];

    this.inputs =[];
    this.outputs = [];

    this.operations = {
      '01': (a, b) => a + b,
      '02': (a, b) => a * b,
      '07': (a, b) => a < b ? 1 : 0,
      '08': (a, b) => a === b ? 1 : 0,
    }
  }

  execute() {
    while(this.memory[this.pointer] !== 99) {
      this.step();
    }

    return this.terminate();
  }

  step() {
    this.runOperation();
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
      opcode, modes
    }
  }
  

  runOperation() {
    const {opcode, modes} = this.parseOpcode();

    if (opcode === '03') {
      const location = this.getParam(1, '1')

      this.memory[location] = this.inputs.pop();

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

      console.log(this.pointer, opcode, input1, input2, output);

      const value = operation(input1, input2);

      this.memory[output] = value;
      this.pointer += 4;
    } else if (opcode === '05' || opcode === '06') {
      const value = this.getParam(1, modes.first);
      const nextPointer = this.getParam(2, modes.second);

      console.log(this.pointer, opcode, value, nextPointer);


      if (opcode === '05' && value !== 0) {
        this.pointer = nextPointer;
      } else if (opcode === '06' && value === 0) {
        this.pointer = nextPointer;
      } else {
        this.pointer += 3;
      }
    } else if (opcode === '99') {
      throw new Error('should have halted');
    } else {
      console.log(this.pointer, this.memory[this.pointer], opcode)
      throw new Error(`unknown opcode ${opcode}`);
    }
  }
  


  getParam(index, mode) {
    const value = this.memory[this.pointer + index];

    return this.getValue(value, mode);
  }

  getValue(value, mode) {
    if (mode === '1') {
      return value;
    } else {
      return this.memory[value];
    }
  }

  enqueueInput(inputs) {
    this.inputs = [...inputs, ...this.inputs];
  }

  terminate() {
    return this.outputs;
  }

}

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const initialProgram = input.split(',').map(Number);


  const computer = new IntCodeComputer(initialProgram);


  computer.enqueueInput([5]);

  const outputs = computer.execute();



  return outputs;
}

function test() {
  console.log(main());
}

test();
