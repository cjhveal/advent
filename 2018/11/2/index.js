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

function powerKernal(x, y, grid, n) {
  let power = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      power += grid[x + i][y + j];
    }
  }

  return power
}


function buildPowerKernal(powerGrid, n) {
  const grid = Array(WIDTH).fill().map(() => Array(HEIGHT).fill(null));

  for (let x = 0; x < WIDTH - n; x++) {
    for (let y = 0; y < HEIGHT - n; y++) {
      const power = powerKernal(x, y, powerGrid, n);

      grid[x][y] = power;
    }
  }

  return grid;
}

function findMaxPowerInKernal(kernal, n) {
  let maxPower = -Infinity;
  let point = null;
  for (let x = 0; x <= WIDTH - n; x++) {
    for (let y = 0; y <= HEIGHT - n; y++) {
      const power = kernal[x][y];
      if (power > maxPower) {
        maxPower = power;
        point = { x, y, power, size: n };
      }
    }
  }

  return point;
}

function findMaxPowerSquare(powerGrid) {
  let maxPower = -Infinity;
  let point = null;
  for (let size = 1; size <= WIDTH; size++) {
    console.log(size);
    const kernal = buildPowerKernal(powerGrid, size);
    const maxForSize = findMaxPowerInKernal(kernal, size);
    if (maxPower < maxForSize.power) {
      point = maxForSize;
      maxPower = maxForSize.power;
    }
  }

  return point;
}

function renderPoint(point) {
  const { x, y, size } = point;

  return `${x + 1},${y + 1},${size}`;
}

function solution(serial) {
  const grid = buildPowerGrid(serial);

  const maxPoint = findMaxPowerSquare(grid);

  console.log(renderPoint(maxPoint));
}

solution(6548);
