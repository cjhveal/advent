const fs = require('fs');


function sum(array) {
  let total = 0;

  for (const item of array) {
    total += item;
  }

  return total;
}

function serializePoint({x, y, step}) {
  return `${x},${y}`;
}


function getWirePoints(operations) {

  let state = { x: 0, y: 0, step: 0 };
  const pointMap = new Map()

  const executeOperation = (count, f) => {
    for (let i = 0; i < count; i++) {
      const nextState = f(state);
      state = nextState;
      pointMap.set(serializePoint(state), state.step);
    }
  }

  const operationsMap = {
    U: (value) => executeOperation(value, (prevState) => ({ x: prevState.x, y: prevState.y + 1, step: prevState.step + 1})),
    D: (value) => executeOperation(value, (prevState) => ({ x: prevState.x, y: prevState.y - 1, step: prevState.step + 1})),
    L: (value) => executeOperation(value, (prevState) => ({ x: prevState.x - 1, y: prevState.y, step: prevState.step + 1})),
    R: (value) => executeOperation(value, (prevState) => ({ x: prevState.x + 1, y: prevState.y, step: prevState.step + 1})),
  }


  for (const [opcode, value] of operations) {
    const operation = operationsMap[opcode];

    operation(value);
  }

  return pointMap;
}

function parseOperation(operationText) {
  const opcode = operationText[0];

  const value = Number(operationText.slice(1));

  return [opcode, value];
}

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const wireOperations = input.split('\n').map(line => line.split(',').map(parseOperation));
  const [firstWireOperations, secondWireOperations] = wireOperations


  const firstWirePoints = getWirePoints(firstWireOperations);
  const secondWirePoints = getWirePoints(secondWireOperations);

  const intersections = [];

  for (const point of firstWirePoints.keys()) {
    if (secondWirePoints.has(point)) {
      const firstDistance = firstWirePoints.get(point);
      const secondDistance = secondWirePoints.get(point);
      intersections.push(firstDistance + secondDistance);
    }
  }

  let minDistance = Infinity;

  for (const d of intersections) {
    if (d < minDistance) {
      minDistance = d;
    }
  }

  return minDistance;
}

function test() {
  console.log(main());
}

test();
