const fs = require('fs');




function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');
  const lines = input.split('\n');

  const height = lines.length;
  const width = lines[0].length;

  const norm = (x) => x % width;

  let x = 0;
  let y = 0;


  let vx = 3;
  let vy = 1;

  let treeCount = 0;
  while (y < height) {
    if (lines[y][x] === '#') {
      treeCount += 1;
    }

    x = norm(x + vx);
    y += vy;
  }

  return treeCount;
}

function test() {
  console.log(main());
}

test();
