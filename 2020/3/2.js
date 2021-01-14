const fs = require('fs');


function countTrees(lines, vx, vy) {
  const height = lines.length;
  const width = lines[0].length;

  const norm = (x) => x % width;

  let x = 0;
  let y = 0;

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


function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');
  const lines = input.split('\n');


  const r1d1 = countTrees(lines, 1, 1);
  const r3d1 = countTrees(lines, 3, 1);
  const r5d1 = countTrees(lines, 5, 1);
  const r7d1 = countTrees(lines, 7, 1);
  const r1d2 = countTrees(lines, 1, 2);


  return r1d1 * r3d1 * r5d1 * r7d1 * r1d2;
}

function test() {
  console.log(main());
}

test();
