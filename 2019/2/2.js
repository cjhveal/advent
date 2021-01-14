const fs = require('fs');

const operations = {
  '1': (a, b) => a + b,
  '2': (a, b) => a * b,
}

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const initialProgram = input.split(',').map(Number);

  const target = 19690720;


  for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
      const program = [...initialProgram];

      program[1] = noun;
      program[2] = verb;

      let pointer = 0;
      while (program[pointer] !== 99) {
        const opcode = program[pointer];
        const input1 = program[pointer+1];
        const input2 = program[pointer+2];
        const output = program[pointer+3];

        const operation = operations[opcode];

        const value1 = program[input1];
        const value2 = program[input2];

        program[output] = operation(value1, value2);

        pointer += 4;
      }


      if (program[0] === target) {
        return 100 * noun + verb;
      }
      
    }
  }

}

function test() {
  console.log(main());
}

test();
