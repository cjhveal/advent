const fs = require('fs');


const DEBUG=true;

function isSumFromSet(target, set) {
  for (const base of set) {
    const delta = target - base;
    const included = set.has(delta);
    if (DEBUG) {
      //console.log(target, base, delta, included);
    }
    if (included) {
      return true;
    }
  }

  return false;
}


function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');
  const lines = input.split('\n');
  const numbers = lines.map(Number);

  const preamble = numbers.slice(0,25);
  const list = numbers.slice(25);

  const preambleSet = new Set(preamble);
  console.log(preamble);


  for (const [index, item] of list.entries()) {
    if (!isSumFromSet(item, preambleSet)) {
      return item;
    }
    preambleSet.delete(numbers[index])
    preambleSet.add(item);
  }
}

function test() {
  console.log(main());
}

test();
