const fs = require('fs');


const DEBUG=false;

function chunk(input, chunkSize) {
  const array = [...input];
  const result = [];
  while (array.length) {
    const value = array.splice(0, chunkSize);
    result.push(value);
  }
  return result;
}

function transpose(m) {
  return m[0].map((x,i) => m.map(x => x[i]))
}

function count(array) {
  const result = {};
  for (const item of array) {
    result[item] = (result[item] || 0) + 1;
  }
  return result;
}


function maxEntry(entries) {
  let max = [null, -Infinity];
  for (const entry of entries) {
    if (entry[1] > max[1]) {
      max = entry;
    }
  }

  return max[0];
}

function mostCommonElement(array) {
  const elemCount = count(array);

  return maxEntry(Object.entries(elemCount));
}

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const messages = input.split('\n').map(line => line.trim().split(''));

  const messagesByChar = transpose(messages);

  const mostCommonChars = messagesByChar.map(mostCommonElement);


  return mostCommonChars.join('');
}

function test() {
  console.log(main());
}

test();
