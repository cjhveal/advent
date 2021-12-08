const fs = require('fs');


const COMMAND_MAP = {
  'up': (state, delta = 1) => ({...state, depth: state.depth - delta}),
  'down': (state, delta = 1) => ({...state, depth: state.depth + delta}),
  'forward': (state, delta = 1) => ({...state, x: state.x + delta}),
  'back': (state, delta = 1) => ({...state, x: state.x - delta}),
}

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');
  const commands = input.split('\n')

  let state = {depth: 0, x: 0}
  for (const command of commands) {
    const [direction, distanceStr] = command.split(' ');
    const distance = Number(distanceStr);

    const handler = COMMAND_MAP[direction];

    state = handler(state, distance);
  }

  return state.x * state.depth;
}

function test() {
  console.log(main());
}

test();
