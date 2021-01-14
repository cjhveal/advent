const fs = require('fs');


const initialState = () => ({ acc: 0, pointer: 0, status: 'running' });

const operators = {
  nop: (state, arg) => ({...state, pointer: state.pointer + 1}),
  acc: (state, arg) => ({...state, acc: state.acc + arg, pointer: state.pointer + 1}),
  jmp: (state, arg) => ({...state, pointer: state.pointer + arg}),
};

function emulate(code) {
  const loopDetector = new Set();

  let state = initialState();

  while (true) {
    if (state.pointer === code.length) {
      return {...state, status: 'complete'};
    }
    const [opcode, argument] = code[state.pointer];
    console.log(state);
    console.log(opcode, argument);
    if (loopDetector.has(state.pointer)) {
      return {...state, status: 'loop'};
    }
    loopDetector.add(state.pointer);

    const operator = operators[opcode];

    state = operator(state, argument);
  }

  return state;
}


function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');
  const lines = input.split('\n');

  const code = lines.map(line => {
    const [opcode, argument] = line.split(' ')

    return [opcode, Number(argument)];
  });

  const state = emulate(code);

  return state.acc;
}

function test() {
  console.log(main());
}

test();
