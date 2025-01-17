import {readFileSync} from 'fs';

const DEBUG = false;

const INSTRUCTIONS = ['R', 'L'] as const;
type Instruction = typeof INSTRUCTIONS[number];

function parseInstruction(char: string): Instruction {
  const instruction = INSTRUCTIONS.find(c => c === char);

  if (instruction) {
    return instruction;
  }

  throw new Error(`invalid instruction: ${instruction}`);
}

class CircularBuffer<T> {
  items: Array<T>;
  index: number;

  constructor(items: Array<T>) {
    this.items = items;
    this.index = 0;
  }

  normalizeIndex(next: number): number {
    const {length} = this.items;
    return (next + length) % length
  }

  advance() {
    this.index = this.normalizeIndex(this.index + 1)
  }

  backward() {
    this.index = this.normalizeIndex(this.index - 1)
  }

  getCurrent(): T {
    return this.items[this.index];
  }

  getNext(): T {
    this.advance();
    return this.getCurrent();
  }

}


type Node = {
  id: string,
  left: string,
  right: string,
  children: {
    [Property in Instruction]: string;
  }
};

const NODE_REGEXP = /(\w+) = \((\w+), (\w+)\)/;
function parseNode(rawNode: string): Node {
  const match = rawNode.match(NODE_REGEXP);

  if (!match) {
    throw new Error(`invalid node string: ${rawNode}`)
  }

  const [fullMatch, id, left, right] = match;

  return {
    id, left, right,
    children: {
      L: left,
      R: right,
    },
  };
}

class NodeTree {
  nodeMap: Map<string, Node>;
  constructor(nodes: Array<Node>) {
    this.nodeMap = new Map();

    for (const node of nodes) {
      this.nodeMap.set(node.id, node);
    }
  }

  getNode(id: string) {
    return this.nodeMap.get(id);
  }

  search(start: string, target: string, instructions: CircularBuffer<Instruction>) {
    let steps = 0;

    let currentNode  = this.getNode(start);
    while (currentNode.id !== target) {
      steps += 1;

      const instruction = instructions.getCurrent();

      const nextId = currentNode.children[instruction];

      currentNode = this.getNode(nextId);
      instructions.advance();
    }

    return steps;
  }
}


function main(filename: string): number {
  const input: string = readFileSync(filename, "utf8");

  const [rawInstructions, rawNodes] = input.trim().split('\n\n');

  const instructionsList = rawInstructions.trim().split('').map(parseInstruction);
  const instructions = new CircularBuffer<Instruction>(instructionsList);

  const nodes = rawNodes.trim().split('\n').map(parseNode);

  
  const tree = new NodeTree(nodes);

  const steps = tree.search('AAA', 'ZZZ', instructions);

  return steps;
}

function test() {
  console.log(main("./input.txt"));
}

function testExample() {
  console.log(main("./example.txt"));
}

function testExample2() {
  console.log(main("./example2.txt"));
}

test();
//testExample();
//testExample2();
