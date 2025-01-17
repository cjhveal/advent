import {readFileSync} from 'fs';

const DEBUG = true;

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

  allNodes(): MapIterator<Node> {
    return this.nodeMap.values();
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

type SearchPredicate = (node: Node) => boolean;
class NodeCursor {
  tree: NodeTree;
  currentNode: Node;
  endPredicate: SearchPredicate;

  constructor(tree: NodeTree, startNode: Node, endPredicate: SearchPredicate) {
    this.tree = tree;
    this.currentNode = startNode;
    this.endPredicate = endPredicate;
  }

  doInstruction(instruction: Instruction) {
    const nextId = this.currentNode.children[instruction];
    this.currentNode = this.tree.getNode(nextId);
  }

  isEndFound(): boolean {
    return this.endPredicate(this.currentNode);
  }
}

class NodeSearcher {
  tree: NodeTree;
  instructionBuffer: CircularBuffer<Instruction>;

  startPredicate: SearchPredicate;
  endPredicate: SearchPredicate;

  cursors: Array<NodeCursor>

  constructor(tree: NodeTree, instructionsList: Array<Instruction>, startPredicate: SearchPredicate, endPredicate: SearchPredicate) {
    this.tree = tree;

    this.startPredicate = startPredicate;
    this.endPredicate = endPredicate;

    this.instructionBuffer = new CircularBuffer<Instruction>(instructionsList);

    const cursors: Array<NodeCursor> = [];
    for (const node of tree.allNodes()) {
      if (startPredicate(node)) {
        const cursor = new NodeCursor(tree, node, endPredicate);

        cursors.push(cursor);
      }
    }

    this.cursors = cursors;
  }

  advanceCursors() {
    const instruction = this.instructionBuffer.getCurrent();

    for (const cursor of this.cursors) {
      cursor.doInstruction(instruction);
    }

    this.instructionBuffer.advance();
  }

  isSearchComplete(): boolean {
    return this.cursors.every(cursor => cursor.isEndFound());
  }

  doSearch(): number {
    let steps = 0;

    while (!this.isSearchComplete()) {
      if (DEBUG) {
        if (this.cursors.some(cursor => cursor.isEndFound())) {
          console.log(steps, this.cursors.map(cursor => cursor.currentNode.id).join(' '));
        }
      }
      steps += 1;

      this.advanceCursors();

    }

    return steps;
  }
}

function makeIdLastCharChecker(targetChar: string): SearchPredicate {
  return (node: Node): boolean => {
    const {id} = node;

    return (id[id.length - 1] === targetChar);
  }
}

function main(filename: string): number {
  const input: string = readFileSync(filename, "utf8");

  const [rawInstructions, rawNodes] = input.trim().split('\n\n');

  const instructionsList = rawInstructions.trim().split('').map(parseInstruction);

  const nodeList = rawNodes.trim().split('\n').map(parseNode);

  const tree = new NodeTree(nodeList);

  const isStartNode = makeIdLastCharChecker('A');
  const isEndNode =  makeIdLastCharChecker('Z');

  const searcher = new NodeSearcher(tree, instructionsList, isStartNode, isEndNode);

  const steps = searcher.doSearch();

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

function testExample3() {
  console.log(main("./example2.txt"));
}

test();
//testExample();
//testExample2();
//testExample3();
