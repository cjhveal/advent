const fs = require('fs');


function maximum(arr) {
  let max = -Infinity;
  for (const x of arr) {
    if (max < x) {
      max = x;
    }
  }

  return max;
}

const SMALL_CAVE_REGEX = /^[a-z]+$/

class Graph {
  constructor(initialEdges) {
    this.graphMap = new Map();

    for (const edge of initialEdges) {
      this.addEdge(edge);
    }
  }

  addEdge(edge) {
    const [source, target] = edge;

    const sourceAdjacent = this.graphMap.get(source) || [];
    const targetAdjacent = this.graphMap.get(target) || [];

    sourceAdjacent.push(target);
    targetAdjacent.push(source);

    this.graphMap.set(source, sourceAdjacent);
    this.graphMap.set(target, targetAdjacent);
  }


  isSmallCave(node) {
    return SMALL_CAVE_REGEX.test(node);
  }

  isValidNeighbor(node, path) {
    if (node === 'start') {
      return false;
    }

    if (this.isSmallCave(node)) {
      const smallCaves = path.filter(this.isSmallCave);
      const caveCount = {};
      for (const cave of smallCaves) {
        caveCount[cave] = caveCount[cave] || 0;
        caveCount[cave] += 1;
      }

      const maxCave = maximum(Object.values(caveCount));

      const allowed = maxCave > 1 ? 1 : 2;


      return (caveCount[node] || 0) < allowed;
    }

    return true;
  }

  getAdjacent(node, path = []) {
    const adjacent = this.graphMap.get(node);

    const validNeighbors = adjacent.filter((n) => this.isValidNeighbor(n, path));

    return validNeighbors;
  }

  iteratePaths(node = 'start', path = ['start']) {
    if (node === 'end') {
      return 1;
    }
    const adjacent = this.getAdjacent(node, path);

    let total = 0;
    for (const nextNode of adjacent) {
      path.push(nextNode);
      total += this.iteratePaths(nextNode, path);
      path.pop();
    }

    return total;
  }
}


function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const edges = input.trim().split('\n').map(line => {
    return line.trim().split('-');
  });

  const graph = new Graph(edges);


  return graph.iteratePaths();

}

function test() {
  console.log(main('input.txt'));
}

function example1() {
  console.log(main('example1.txt'));
}

function example2() {
  console.log(main('example2.txt'));
}

function example3() {
  console.log(main('example3.txt'));
}

//example3();
test();
