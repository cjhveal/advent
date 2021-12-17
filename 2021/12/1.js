const fs = require('fs');


function countPaths(graphMap, source) {
  if (source === 'end') {
    return 1;
  }

  const adjacent = graphMap.get(source);
  if (!adjacent || !adjacent.length) {
    return 0;
  }

  let total = 0;
  for (const target of adjacent) {
    total += countPaths(graphMap, target);
  }

  return total;
}


function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const edges = input.trim().split('\n').map(line => {
    return line.trim().split('-');
  });

  const graphMap = new Map();

  for (const [source, target] of edges) {
    const adjacent = graphMap.get(source) || [];
    adjacent.push(target);
    graphMap.set(source, adjacent);
  }


  return countPaths(graphMap, 'start');
}

function test() {
  console.log(main('input.txt'));
}

function example1() {
  console.log(main('example1.txt'));
}

example1();
//test();
