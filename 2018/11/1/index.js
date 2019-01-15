function getHundredsDigit(n) {
  return Math.floor(n / 100) % 10;
}

function powerLevelForCell(x, y, serial) {
  const rackId = x + 10;

  let powerLevel = rackId * y;

  powerLevel += serial;

  powerLevel = powerLevel * rackId;

  powerLevel = getHundredsDigit(powerLevel);

  powerLevel -= 5;

  return powerLevel;
}

const WIDTH = 300;
const HEIGHT = 300;

console.log(powerLevelForCell(3, 5, 8));
console.log(powerLevelForCell(122, 79, 57));

function buildPowerGrid(serial) {
  const grid = Array(WIDTH).fill().map(() => Array(HEIGHT).fill(null));

  for (let x = 1; x <= WIDTH; x++) {
    for (let y = 1; y <= HEIGHT; y++) {
      const power = powerLevelForCell(x, y, serial);

      grid[x - 1][y - 1] = power;;
    }
  }

  return grid;
}

function powerKernal(x, y, grid) {
  let power = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      power += grid[x + i][y + j];
    }
  }

  return power
}


function buildPowerKernal(powerGrid) {
  const grid = Array(WIDTH).fill().map(() => Array(HEIGHT).fill(null));

  for (let x = 0; x < WIDTH - 3; x++) {
    for (let y = 0; y < HEIGHT - 3; y++) {
      const power = powerKernal(x, y, powerGrid);

      grid[x][y] = power;
    }
  }

  return grid;
}

function findMaxPowerKernal(kernal) {
  let maxPower = -Infinity;
  let point = null;
  for (let x = 0; x < WIDTH - 3; x++) {
    for (let y = 0; y < HEIGHT - 3; y++) {
      if (kernal[x][y] > maxPower) {
        maxPower = kernal[x][y];
        point = { x, y };
      }
    }
  }

  return point;
}

function renderPoint(point) {
  const { x, y } = point;

  return `${x + 1},${y + 1}`;
}

function findMaxPowerSquare(serial) {
  const grid = buildPowerGrid(serial);

  const kernal = buildPowerKernal(grid);

  const maxPoint = findMaxPowerKernal(kernal);

  console.log(renderPoint(maxPoint));
}

findMaxPowerSquare(6548);
