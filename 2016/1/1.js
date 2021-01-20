const fs = require('fs');


const DEBUG=false;



function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const instructions = input.split(', ')

  let state = { heading: 0, x: 0, y: 0 };


  for (const instruction of instructions) {
    const turn = instruction[0];
    const count = Number(instruction[1]);

    const turnSign = turn === 'R' ? 1 : -1;

    const nextHeading = (((state.heading + turnSign) % 4) + 4) % 4;

    const nextState = {
      x: state.x + count*Math.round(Math.sin(nextHeading*Math.PI/2)),
      y: state.y + count*Math.round(Math.cos(nextHeading*Math.PI/2)),
      heading: nextHeading,
    }

    state = nextState;
  }
  

  return state.x + state.y;

}

function test() {
  console.log(main());
}

test();
