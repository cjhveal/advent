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

  const layerCounts = layers.map(layer => count(layer));

  let min0Layer = null;
  for (const layerCount of layerCounts) {
    if (!min0Layer || layerCount[0] < min0Layer[0]) {
      min0Layer = layerCount;
    }
  }

  return min0Layer[1] * min0Layer[2];
}

function test() {
  console.log(main());
}

test();
