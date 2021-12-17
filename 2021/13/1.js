const fs = require('fs');

const FOLD_REGEX = /fold along (\w+)=(\d+)/;
function parseFold(rawFold) {
  const match = rawFold.trim().match(FOLD_REGEX);

  if (!match) {
    throw new Error('invalid parse fold', rawFold);
  }

  const [fullMatch, axis, value] = match;

  return { axis, value: Number(value) };
}

function foldGrid(pointSet, fold) {
  const nextSet = new Set();

  for (const rawPoint of pointSet) {
    const [x, y] = rawPoint.split(',').map(Number);
    
    const point = { x, y }
    const { axis, value } = fold;

    if (point[axis] > value) {
      const distance = Math.abs(point[axis] - value);
      point[axis] = value - distance;
    }

    nextSet.add(`${point.x},${point.y}`);
  }

  return nextSet;
}

function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const [rawPoints, rawFolds] = input.trim().split('\n\n');
  
  const folds = rawFolds.split('\n').map(parseFold);

  const points = rawPoints.split('\n');
  let pointSet = new Set(points);
  
  const firstFold = folds[0];

  const foldedSet = foldGrid(pointSet, firstFold);

  return foldedSet.size;
  
}

function test() {
  console.log(main('input.txt'));
}

function example() {
  console.log(main('example.txt'));
}

//example();
test();
