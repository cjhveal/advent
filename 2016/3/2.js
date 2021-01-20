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

function flatten(arr) {
  return [].concat(...arr);
}


function isValidTriangle(a, b, c) {
  return (a + b > c) && (a + c > b) && (b + c > a);
}

const tripleRegex = /(\d+)\s+(\d+)\s+(\d+)/;
function parseTriple(tripleText) {
  const tripleMatch = tripleText.match(tripleRegex);

  if (!tripleMatch) {
    throw new Error(`cannot parse triangle: ${tripleText}`);
  }

  const [fullMatch, a, b, c] = tripleMatch;

  return [a, b, c].map(x => Number(x));
}

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const triples = input.split('\n').map(parseTriple);

  const triangles = flatten(chunk(triples, 3).map(transpose));



  let total = 0;

  for (const [a,b,c] of triangles) {
    if (isValidTriangle(a,b,c)) {
      total += 1;
    }
  }

  return total;
}

function test() {
  console.log(main());
}

test();
