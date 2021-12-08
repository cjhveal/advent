const fs = require('fs');

function findBounds(list) {
  let min = Infinity;
  let max = -Infinity;

  for (const n of list) {
    if (n < min) {
      min = n
    }
    if (n > max) {
      max = n
    }
  }

  return [min, max];
}

function deltaSum(list, x) {
  let total = 0;

  for (const item of list) {
    const delta = Math.abs(item - x);
    total += delta * (delta + 1) / 2
  }

  return total;
}


function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const positions = input.split(',').map(Number);

  const [min, max] = findBounds(positions);

  let minFuel = Infinity;
  let minIndex = null;
  for (let i = min; i <= max; i++) {
   const fuelRequired = deltaSum(positions, i);
    if (fuelRequired < minFuel) {
      minFuel = fuelRequired;
      minIndex = i;
    }
  }

  return minFuel;

}

function test() {
  console.log(main('input.txt'));
}

function example() {
  console.log(main('example.txt'));
}

//example();
test();
