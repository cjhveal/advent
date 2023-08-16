const fs = require('fs');

const DEBUG = false;


class DirNode {
  constructor(name, children = [], files = []) {
    this.name = name;

    this.children = children;
    this.files = files;
    this.parent = null;
  }

  size() {
    if (this._size) {
      return this._size;
    }

    let total = 0;
    for (const child of this.children) {
      total += child.size();
    }

    for (const file of this.files) {
      total += file;
    }

    this._size = total;

    return total;
  }

  addChild(node) {
    this.children.push(node);

    node.parent = this;

    this._size = null;
  }

  addFile(file) {
    this.files.push(file)

    this._size = null;
  }

  walk(fn) {
    fn(this);

    for (const child of this.children) {
      child.walk(fn);
    }
  }
}

class TerminalParser {
  constructor(rawInput) {
    this.root = new DirNode('/');
    this.currentNode = this.root;
  }


  run(command) {
    const lines = command.split('\n');
    const instruction = lines[0].trim();
    const results = lines.slice(1);

    if (instruction === 'ls') {
      this.parseList(results);
    } else {
      const [cd, directory] = instruction.split(' ');
      this.changeDirectory(directory);
    }
  }

  changeDirectory(name) {
    if (name === this.root.name) {
      this.currentNode = this.root;
    } else if (name === '..') {
      if (this.currentNode === this.root) {
        throw new Error('already at root');
      }
      this.currentNode = this.currentNode.parent;
    } else {
      for (const child of this.currentNode.children) {
        if (child.name === name) {
          this.currentNode = child;
          break;
        }
      }
    }
  }

  parseList(results) {
    for (const result of results) {

      const [rawSize, name] = result.trim().split(' ');

      if (rawSize === 'dir') {
        const node = new DirNode(name);
        this.currentNode.addChild(node);
      } else {
        const size = parseInt(rawSize, 10);
        this.currentNode.addFile(size);
      }
    }
  }
}

function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');


  // remove first $
  const trimmedInput = input.slice(2).trim();

  const rawCommands = trimmedInput.split('\n$ ');


  const parser = new TerminalParser();

  for (const command of rawCommands) {
    parser.run(command);
  }


  const candidates = [];

  parser.root.walk((dir) => {
    if (dir.size() <= 100000) {
      candidates.push(dir); 
    }
  });

  let total = 0;
  for (const candidate of candidates) {
    total += candidate.size();
  }

  return total;
}

function test() {
  console.log(main('./input.txt'));
}

function example() {
  console.log(main('./example.txt'));
}

function example2() {
  console.log(main('./example2.txt'));
}

function example3() {
  console.log(main('./example3.txt'));
}

function example4() {
  console.log(main('./example4.txt'));
}

function example5() {
  console.log(main('./example5.txt'));
}

test();
//example();
//example2();
