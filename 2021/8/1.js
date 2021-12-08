const fs = require('fs');

function isUniqueSegment(pattern) {
  return [2, 3, 4, 7].includes(pattern.length);
}

function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const lines = input.trim().split('\n')

  const entries = lines.map(entry => entry.split(' | ').map(x => x.trim().split(' ')));

  
  let total = 0;
  for (const entry of entries) {
    const [signalPatterns, outputPatterns] = entry;

    for (const pattern of outputPatterns) {
      if (isUniqueSegment(pattern)) {
        total += 1;
      }
    }
  }

  return total;
}

function test() {
  console.log(main('input.txt'));
}

function example() {
  console.log(main('example.txt'));
}

//example();
test();
