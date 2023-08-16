const fs = require('fs');


function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');
  const elves = input.split('\n\n').map(rawElf => rawElf.split('\n').map(Number))

  let max = -1 * Infinity;
  for (const elf of elves) {
    let total = 0;
    for (const item of elf) {
      total += item;
    }

    if (total > max) {
      max = total;
    }
  }

  return max;

}

function test() {
  console.log(main());
}

test();
