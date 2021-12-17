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


function findGridMax(pointSet) {
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const point of pointSet) {
    const [x, y] = point.split(',').map(Number);
    if (x > maxX) {
      maxX = x;
    }

    if (y > maxY) {
      maxY = y;
    }
  }

  return [maxX, maxY]
}

function printGrid(pointSet) {
  const [maxX, maxY] = findGridMax(pointSet);

  for (let y = 0; y <= maxY; y++) {
    let line = '';
    for (let x = 0; x <= maxX; x++) {
      if (pointSet.has(`${x},${y}`)) {
        line += '#';
      } else {
        line += '.';
      }
    }
    console.log(line);
  }
}

function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const [rawPoints, rawFolds] = input.trim().split('\n\n');
  
  const folds = rawFolds.split('\n').map(parseFold);

  const points = rawPoints.split('\n');
  let pointSet = new Set(points);
  
  for (const fold of folds) {
    pointSet = foldGrid(pointSet, fold);
  }

  return pointSet;
}

function test() {
  printGrid(main('input.txt'));
}

function example() {
  printGrid(main('example.txt'));
}

//example();
test();
