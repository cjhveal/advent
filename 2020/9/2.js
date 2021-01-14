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


  const target = 144381670;


  let start = 0;
  let end = start;

  let total = 0;

  while(end <= numbers.length) {
    if (total < target) {
      total += numbers[end];
      end += 1
    } else if (total > target) {
      total = 0;
      start += 1;
      end = start;
    } else if (total === target) {
      const targetList = numbers.slice(start,end);

      const min = Math.min(...targetList);
      const max = Math.max(...targetList);
      
      console.log(min, max);

      return min + max;
    }
  }

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
