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
    this.inputs = [...inputs.reverse(), ...this.inputs];
  }

  terminate() {
    return this.outputs;
  }

}

const permutator = (inputArr) => {
  let result = [];

  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m)
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next))
     }
   }
 }

 permute(inputArr)

 return result;
}



function testPhaseSetting(phases, program) {
  const [phase1, phase2, phase3, phase4, phase5] = phases;

  const ampA = new IntCodeComputer(program);
  const ampB = new IntCodeComputer(program);
  const ampC = new IntCodeComputer(program);
  const ampD = new IntCodeComputer(program);
  const ampE = new IntCodeComputer(program);

  ampA.enqueueInput([phase1, 0])
  const [output1] = ampA.execute();

  ampB.enqueueInput([phase2, output1]);
  const [output2] = ampB.execute();

  ampC.enqueueInput([phase3, output2]);
  const [output3] = ampC.execute();

  ampD.enqueueInput([phase4, output3]);
  const [output4] = ampD.execute();

  ampE.enqueueInput([phase5, output4]);
  const [output5] = ampE.execute();

  return output5;
}

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const initialProgram = input.split(',').map(Number);

  const allPhaseSettings = permutator([0,1,2,3,4]);

  let maxOutput = -Infinity;
  for (const phaseSetting of allPhaseSettings) {
    const output = testPhaseSetting(phaseSetting, initialProgram);

    if (output > maxOutput) {
      maxOutput = output;
    }
  }

  return maxOutput;
}

function test() {
  console.log(main());
}

test();
