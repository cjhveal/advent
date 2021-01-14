const fs = require('fs');

function chunk(input, chunkSize) {
  const array = [...input];
  const result = [];
  while (array.length) {
    const value = array.splice(0, chunkSize);
    result.push(value);
  }
  return result;
}

function count(array) {
  let result = {};
  for (const item of array) {
    result[item] = (result[item] || 0) + 1
  }

  return result;
}

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');


  const pixels = input.split('').map(x => Number(x))
  const layers = chunk(pixels, 25*6);

  const buffer = new Array(25*6).fill(2);

  for (const layer of layers) {
    for (let i = 0; i < layer.length; i++) {
      if (buffer[i] === 2) {
        buffer[i] = layer[i];
      }
    }
  }

  const rasteredBuffer = buffer.map(x => x === 0 ? ' ' : `\u2588`);

  const rasteredLines = chunk(rasteredBuffer, 25).map(x => x.join('')).join('\n');

  return rasteredLines;
}

function test() {
  console.log(main());
}

test();
