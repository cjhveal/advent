const fs = require('fs');


function sum(array) {
  let total = 0;

  for (const item of array) {
    total += item;
  }

  return total;
}

function serializePoint({x, y}) {
  return `${x},${y}`;
}


function getWirePoints(operations) {

  let state = { x: 0, y: 0 };
  const pointSet = new Set(serializePoint(state));

  const executeOperation = (count, f) => {
    for (let i = 0; i < count; i++) {
      const nextState = f(state);
      state = nextState;
      pointSet.add(serializePoint(state));
    }
  }

  const operationsMap = {
    U: (value) => executeOperation(value, (prevState) => ({ x: prevState.x, y: prevState.y + 1 })),
    D: (value) => executeOperation(value, (prevState) => ({ x: prevState.x, y: prevState.y - 1 })),
    L: (value) => executeOperation(value, (prevState) => ({ x: prevState.x - 1, y: prevState.y  })), 
    R: (value) => executeOperation(value, (prevState) => ({ x: prevState.x + 1, y: prevState.y  })), 
  }


  for (const [opcode, value] of operations) {
    const operation = operationsMap[opcode];

    operation(value);
  }

  return pointSet;

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

  const intersectionSet = new Set();

  for (const point of firstWirePoints) {
    if (secondWirePoints.has(point)) {
      intersectionSet.add(point);
    }
  }

  const intersections = [...intersectionSet]
  console.log(intersections);

  const distances = intersections
    .map(point => sum(point.split(',').map(x => Math.abs(Number(x)))))
    .filter(Boolean)


  let minDistance = Infinity;

  for (const d of distances) {
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
