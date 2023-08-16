const fs = require('fs');

function sumWrappedList(list) {
  let total = 0;
  for (const item of list) {
    total += item[0];
  }
  return total;
}

function sortWrappedList(items) {
  const sortedItems = items.sort((a, b) => b[0] - a[0]);

  return sortedItems;
}


function* combinations(items, target) {
  const sortedItems = sortWrappedList(items);

  function* generate(stack = [], start = 0) {
    const sum = sumWrappedList(stack);

    if (sum === target) {
      yield stack;
    } else if (sum < target) {
      for (let i = start; i < sortedItems.length; i++) {
        const item = sortedItems[i];

        if (!stack.includes(item)) {
          stack.push(item);
          yield* generate(stack, i);
          stack.pop();
        }
      }
    }
  }

  yield* generate();
}

function main(input, target) {
  const containers = input.trim().split('\n').map(n => [parseInt(n, 10)]);

  const counts = [];
  for (const combo of combinations(containers, target)) {
    const i = combo.length - 1

    counts[i] = (counts[i] || 0) + 1;
  }

  return counts.find(Boolean);
}

function runFromFile(inputFile, ...args) {
  const input = fs.readFileSync(inputFile, 'utf8');

  console.log(main(input, ...args));
}

function test() {
  runFromFile('input.txt', 150);
}

function example() {
  runFromFile('example.txt', 25);
}

//example();
test();
