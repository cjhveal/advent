const fs = require('fs');


/**
 * A Min-Priority Queue implementation
 * utilizes three primary data structures:
 * 1. a standard array to implement a min-heap for O(log n) extractMin operation
 * 2. a map to improve decreasePriority complexity from O(n) to O(log n)
 * 3. a set to improve member inclusion checks from O(n) to O(1)
 */
class MinQueue {
  constructor() {
    this.heap = [];
    this.map = {};
    this.set = new Set();
  }

  getMin() {
    return this.heap[0];
  }

  // to insert a node, we add it as the final leaf node and upHeapify it into the correct place
  insertWithPriority(node, priority) {
    this.heap.push({node, priority})
    this.map[node] = this.heap.length - 1;
    this.set.add(node);

    this.upHeapify(this.heap.length - 1);
  }

  // to extract the minimum, we swap it with a leaf node and perform a downHeapify from the root
  extractMin() {
    this.swap(0, this.heap.length - 1);

    const [removed] = this.heap.splice(this.heap.length - 1);

    delete this.map[removed.node];
    this.set.delete(removed.node);

    this.downHeapify(0);

    return removed;
  }

  // upHeapify looks at its parent and swaps it if the parent is larger
  upHeapify(i) {
    const parent = Math.floor((i - 1) / 2);


    if (parent >= 0 && this.heap[parent].priority > this.heap[i].priority) {
      this.swap(i, parent);
      this.upHeapify(parent);
    }
  }

  // downHeapify looks at its children and swaps with them if either are smaller than it
  downHeapify(i) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    let smallest = i;

    if (left < this.heap.length && this.heap[left].priority < this.heap[smallest].priority) {
      smallest = left;
    }

    if (right < this.heap.length && this.heap[right].priority < this.heap[smallest].priority) {
      smallest = right;
    }

    if (smallest !== i) {
      this.swap(i, smallest);
      this.downHeapify(smallest);
    }
  }

  // decreasePriority requires upHeapify to 
  decreasePriority(node, priority) {
    const index = this.map[node];

    this.heap[index].priority = priority;
    this.upHeapify(index);
  }

  swap(i, j) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;

    this.map[this.heap[i].node] = i;
    this.map[this.heap[j].node] = j;
  }

  size() {
    return this.heap.length;
  }

  has(node) {
    return this.set.has(node);
  }
}

function makeGrid(height, width, defaultValue = 0) {
  const rows = Array(height).fill(defaultValue);
  const grid = rows.map((x) => Array(width).fill(defaultValue));

  return grid;
}

/**
 * Grid class that implements Dijkstra's algorithm backed by a priority queue
 * Responsible for generating valid, in-bounds neighbors, and holding grid state.
 */
class Grid {
  constructor(input) {
    this.gridTemplate = input.trim().split('\n').map((line) => {
      return line.trim().split('').map(Number);
    });

    const height = this.gridTemplate.length;
    const width = this.gridTemplate[0].length;

    this.grid = makeGrid(height*5, width*5);
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[0].length; col++) {
        if (row < height && col < width) {
          this.grid[row][col] = this.gridTemplate[row][col]
        } else if (row >= height) {
          const prevValue = this.grid[row - height][col];
          const value = (prevValue % 9) + 1
          this.grid[row][col] = value;
        } else if (col >= width) {
          const prevValue = this.grid[row][col - width];
          const value = (prevValue % 9) + 1
          this.grid[row][col] = value;
        }
      }
    }


    this.distances = makeGrid(height*5, width*5, Infinity);
    this.distances[0][0] = 0;

    this.queue = new MinQueue();
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[0].length; col++) {
        this.queue.insertWithPriority(`${col},${row}`, this.distances[row][col]);
      }
    }
  }

  inBounds(x, y) {
    if (x < 0 || y < 0) {
      return false;
    }
    if (y >= this.grid.length || x >= this.grid[0].length) {
      return false;
    }

    return true;
  }

  isValidNeighbor(x, y) {
    return this.inBounds(x, y) && this.queue.has(`${x},${y}`);
  }

  findValidNeighbors(col, row) {
    const neighbors = [
      [col, row - 1],
      [col, row + 1],
      [col - 1, row],
      [col + 1, row],
    ];

    const validNeighbors = neighbors.filter(([x, y]) => this.isValidNeighbor(x, y));

    return validNeighbors
  }

  computeShortestPaths() {
    while (this.queue.size() > 0) {
      const currentNode = this.queue.extractMin();
      const [col, row] = currentNode.node.split(',').map(Number);

      const neighbors = this.findValidNeighbors(col, row);

      for (const neighbor of neighbors) {
        const [x, y] = neighbor;
        const distance = this.distances[row][col] + this.grid[y][x];
        if (distance < this.distances[y][x]) {
          this.distances[y][x] = distance;
          this.queue.decreasePriority(`${x},${y}`, distance);
        }
      }
    }
  }

  targetDistance() {
    const height = this.distances.length;
    const width = this.distances[0].length;

    return this.distances[height - 1][width - 1];
  }

  print() {
    for (let col = 0; col < this.grid.length; col++) {
      const line = this.grid[col].join('');
      console.log(line);
    }
  }
}

function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const graph = new Grid(input);

 // graph.print();

  graph.computeShortestPaths();

  return graph.targetDistance();


}

function test() {
  console.log(main('input.txt'));
}

function example() {
 console.log(main('example.txt'));
}

//example();
test();