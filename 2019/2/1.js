const fs = require('fs');

const operations = {
  '1': (a, b) => a + b,
  '2': (a, b) => a * b,
}

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');
  
  const program = input.split(',').map(Number);

  // 1202 sequence
  program[1] = 12;
  program[2] = 2;

  let pointer = 0;
  while (program[pointer] !== 99) {
    const opcode = program[pointer];
    const input1 = program[pointer+1];
    const input2 = program[pointer+2];
    const output = program[pointer+3];
    console.log(pointer, opcode, input1, input2, output);

    const operation = operations[opcode];

    const value1 = program[input1];
    const value2 = program[input2];

    program[output] = operation(value1, value2);

    pointer += 4;
  }

  return program[0];
}

function test() {
  console.log(main());
}

test();
