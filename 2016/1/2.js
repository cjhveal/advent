const fs = require('fs');


const DEBUG=false;



function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const instructions = input.split(', ')
  //const instructions = ['R8', 'R4', 'R4', 'R8'];

  let state = { heading: 0, x: 0, y: 0 };


  const locationSet = new Set('0,0');

  const checkLocation = (x, y) => {
    const locationKey = `${x},${y}`;
    if (DEBUG) {
      console.log(locationKey);
    }
    if (locationSet.has(locationKey)) {
      return Math.abs(x) + Math.abs(y);
    }

    locationSet.add(locationKey);

    return;
  }

  for (const instruction of instructions) {
    const turn = instruction[0];
    const count = Number(instruction.slice(1));

    const turnSign = turn === 'R' ? 1 : -1;

    const nextHeading = (((state.heading + turnSign) % 4) + 4) % 4;

    const deltaX = count*Math.round(Math.sin(nextHeading*Math.PI/2));
    const deltaY = count*Math.round(Math.cos(nextHeading*Math.PI/2));

    const nextState = {
      x: state.x + deltaX,
      y: state.y + deltaY,
      heading: nextHeading,
    }

    if (deltaX < 0) {
      for (let i = 0; i > deltaX; i--) {
        const result = checkLocation(state.x+i, state.y);
        if (result) {
          return result;
        }
      }
    } else if (deltaX > 0) {
      for (let i = 0; i < deltaX; i++) {
        const result = checkLocation(state.x+i, state.y);
        if (result) {
          return result;
        }
      }
    } else if (deltaY < 0) {
      for (let i = 0; i > deltaY; i--) {
        const result = checkLocation(state.x, state.y+i);
        if (result) {
          return result;
        }
      }
    } else if (deltaY > 0) {
      for (let i = 0; i < deltaY; i++) {
        const result = checkLocation(state.x, state.y+i);
        if (result) {
          return result;
        }
      }
    }

    state = nextState;
  }

  return null;
}

function test() {
  console.log(main());
}

test();
