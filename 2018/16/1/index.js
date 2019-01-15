const INPUT = require('./input');

class VM  {
  constructor(registers = [0, 0, 0, 0]) {
    this.registers = [...registers];
  }

  execute(operation, instruction) {
    const { a, b, c } = instruction;
    operation(a, b, c, this.registers);
  }

  run(instructions) {

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
  console.log(a, b, c, registers);
  const x = registers[a];
  registers[c] = x + b;
}

function mulr(a, b, c, registers) {
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

    this.mapping = Array.from({ length: 16 }).fill(() => new Set());
  }

  refine(example) {
    for (const op of this.operations) {
      const vm = new VM(example.before);
      vm.execute(op, example.instruction);

      const valid = elemEq(example.after, vm.registers)

      const { opcode } = example.instruction;

      if (valid) {
        this.mapping[opcode].add(op);
      } else {
        this.mapping[opcode].delete(op);
      }
    }
  }

  reify() {
    this.mapping.map(set => {
      if (set.size !== 1) {
        throw new Error('did not sufficiently whittle down map');
      }

      const [value] = set.values();

      return value;
    });
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

  return examples;
}

function testExample(example) {
  let count = 0;
  for (const opName of Object.keys(VM.operationsMap)) {
    const op = VM.operationsMap[opName];
    const vm = new VM(example.before);
    vm.execute(op, example.instruction);
    console.log(opName, example.after, vm.registers);
    if (elemEq(example.after, vm.registers)) {
      count += 1;
    }
  }
  return count;
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
  const examples = parseInput(input);

  let count = 0;

  for (const example of examples) {
    const n = testExample(example);
    if (n >= 3) {
      count += 1;
    }
  }

  return count;
}

const EXAMPLE = `Before: [3, 2, 1, 1]
9 2 1 2
After:  [3, 2, 2, 1]`;

console.log(solution(INPUT));
