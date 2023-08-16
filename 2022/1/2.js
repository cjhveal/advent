const fs = require('fs');

function sum(list) {
  let total = 0;
  for (let item of list) {
      total += item;
  }

  return total;
}

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');
  const elves = input.split('\n\n').map(rawElf => sum(rawElf.split('\n').map(Number)))

  elves.sort((a, b) => b - a);

  //console.log(elves);

  const top = elves.slice(0, 3);

  return sum(top);

}

function test() {
  console.log(main());
}

test();
