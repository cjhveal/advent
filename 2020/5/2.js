const fs = require('fs');



const rowRange = () => [0, 127];
const seatRange = () => [0, 7];

const mid = (min, max) => min + ((max - min) / 2);
const floor = Math.floor;
const ceil = Math.ceil;


const firstHalf = ([a,b]) => [a, floor(mid(a,b))];
const lastHalf = ([a,b]) => [ceil(mid(a,b)), b];

const f = firstHalf;
const b = lastHalf;



const ops = {
  'F': firstHalf,
  'B': lastHalf,
  'L': firstHalf,
  'R': lastHalf,
}

const evaluateId = (range, id) => {
  let result = range;
  for (const opcode of id) {
    const operator = ops[opcode];
    result = operator(result);
  }
  if (result[0] === result[1]) {
    return result[0];
  }
}

const parseTicket = (ticket) => {
  const rowId = ticket.slice(0, 7);
  const seatId = ticket.slice(7, 11);

  const row = evaluateId(rowRange(), rowId);
  const seat = evaluateId(seatRange(), seatId);

  return [row, seat];
}

const calcSeatId = ([row, col]) => row*8 + col;

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');
  const lines = input.split('\n');

  const seatAssignments = lines.map(parseTicket);
  const seatIds = seatAssignments.map(calcSeatId).sort((a,b) => a -b);

  let lastId = null;
  for (const id of seatIds) {
    if (!lastId) {
      lastId = id;
      continue;
    }

    if (id - lastId > 1) {
      return (id - 1);
    }

    lastId = id;
  }
}

function test() {
  console.log(main());
}

test();
