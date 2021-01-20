const fs = require('fs');


const DEBUG=false;



function isValidTriangle(a, b, c) {
  return (a + b > c) && (a + c > b) && (b + c > a);
}

const triangleRegex = /(\d+)\s+(\d+)\s+(\d+)/;
function parseTriangle(triangleText) {
  const triangleMatch = triangleText.match(triangleRegex);

  if (!triangleMatch) {
    throw new Error(`cannot parse triangle: ${triangleText}`);
  }

  const [fullMatch, a, b, c] = triangleMatch;

  return [a, b, c].map(x => Number(x));
}

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const triangles = input.split('\n').map(parseTriangle);

  console.log(triangles);

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
