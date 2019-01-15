const INPUT = require('./input');

class VM  {
  constructor(registers = [0, 0, 0, 0], ops = VM.operations) {
    this.registers = [...registers];
    this.ops = ops;
  }

  execute(operation, instruction) {
    const { a, b, c } = instruction;
    operation(a, b, c, this.registers);
  }

  run(instructions) {
    for (const instruction of instructions) {
      const { opcode } = instruction;
      const op = this.ops[opcode];
      this.execute(op, instruction);
      console.log(op, this.registers);
    }
  }
}

VM.operations = [addr, addi, mulr, muli, banr, bani, borr, bori, setr, seti, gtir, gtri, gtrr, eqir, eqri, eqrr];
VM.operationsMap = { addr, addi, mulr, muli, banr, bani, borr, bori, setr, seti, gtir, gtri, gtrr, eqir, eqri, eqrr };

function addr(a, b, c, registers) {
  const x = registers[a];
  const y = registers[b];
  registers[c] = x + y;
}

function addi(a, b, c, registers) {
  const x = registers[a];
  registers[c] = x + b;
}

function mulr(a, b, c, registers) {
  console.log(a, b, c);
  const x = registers[a];
  const y = registers[b];
  registers[c] = x * y;
}

function muli(a, b, c, registers) {
  const x = registers[a];
  registers[c] = x * b;
}

function banr(a, b, c, registers) {
  const x = registers[a];
  const y = registers[b];
  registers[c] = x & y;
}

function bani(a, b, c, registers) {
  const x = registers[a];
  registers[c] = x & b;
}

function borr(a, b, c, registers) {
  const x = registers[a];
  const y = registers[b];
  registers[c] = x | y;
}

function bori(a, b, c, registers) {
  const x = registers[a];
  registers[c] = x | b;

}

function setr(a, b, c, registers) {
  const x = registers[a];
  registers[c] = x;
}

function seti(a, b, c, registers) {
  registers[c] = a;
}

function gtir(a, b, c, registers) {
  const y = registers[b];
  registers[c] = a > y ? 1 : 0;
}

function gtri(a, b, c, registers) {
  const x = registers[a];
  registers[c] = x > b ? 1 : 0;
}

function gtrr(a, b, c, registers) {
  const x = registers[a];
  const y = registers[b];
  registers[c] = x > y ? 1 : 0;
}

function eqir(a, b, c, registers) {
  const y = registers[b];
  registers[c] = a === y ? 1 : 0;
}

function eqri(a, b, c, registers) {
  const x = registers[a];
  registers[c] = x === b ? 1 : 0;
}

function eqrr(a, b, c, registers) {
  const x = registers[a];
  const y = registers[b];
  registers[c] = x === y ? 1 : 0;
}



class OpMapping {
  constructor(operations) {
    this.operations = operations;

    this.mapping = Array.from({ length: 16 }).fill().map(() => new Set(operations));
  }

  refine(example) {
    for (const op of this.operations) {
      const vm = new VM(example.before);
      vm.execute(op, example.instruction);

      const valid = elemEq(example.after, vm.registers)

      const { opcode } = example.instruction;

      if (!valid) {
        this.mapping[opcode].delete(op);
      }
    }
  }

  reify() {
    const valuesToPick = new Set(this.operations);
    const realization = Array.from({ length: 16 }).fill();

    while (valuesToPick.size > 0) {
      for (let i = 0; i < this.mapping.length; i++) {
        const set = this.mapping[i];
        if (set.size === 1) {
          const [value] = set.values();
          realization[i] = value;
          valuesToPick.delete(value);
          for (const others of this.mapping) {
            others.delete(value);
          }
          break;
        }
      }
    }

    return realization;
  }
}


const EXAMPLE_REGEX = /.+:\s+(.+)$/;

function parseExample(rawExample) {
  const lines = rawExample.split('\n');

  const rawBefore = lines[0].split(': ')[1].trim();
  const rawAfter = lines[2].split(': ')[1].trim();
  const rawInstruction = lines[1].trim();;

  const before = JSON.parse(rawBefore);
  const after = JSON.parse(rawAfter);

  const [opcode, a, b, c] = rawInstruction.split(' ').map(Number);

  return {
    before, after,
    instruction: {
      opcode, a, b, c
    }
  }
}

function parseInput(input) {
  const [rawExamples, rawProgram] = input.split('\n\n\n');

  const examples = rawExamples.split('\n\n').map(parseExample);

  const program = rawProgram.trim().split('\n').map(rawInstruction => {
    const [opcode, a, b, c] = rawInstruction.trim().split(' ').map(Number);
    return { opcode, a, b, c };
  });

  return { examples, program };
}

function elemEq(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

function solution(input) {
  const { examples, program } = parseInput(input);

  const opMap = new OpMapping(VM.operations);

  for (const example of examples) {
    opMap.refine(example);
  }

  const mapping = opMap.reify();

  const vm = new VM([0, 0, 0, 0], mapping)

  vm.run(program);

}

const EXAMPLE = `Before: [3, 2, 1, 1]
9 2 1 2
After:  [3, 2, 2, 1]`;

console.log(solution(INPUT));
