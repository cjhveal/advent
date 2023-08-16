const fs = require('fs');

const DEBUG = false;


const instructionRegex = /move (\d+) from (\d+) to (\d+)/;

function parseInstruction(rawInstruction) {
  const match = rawInstruction.match(instructionRegex)

  if (!match) {
    throw new Error('cannot parse instruction: ' + rawInstruction);
  }

  const [fullMatch, count, source, target] = match;

  return [count, source, target].map(x => parseInt(x, 10));
}

class StackGroup {
  constructor(lines) {

    const validLines = lines.slice(0, lines.length - 1);

    this.width = Math.ceil(validLines[0].length / 4)

    this.stacks = Array.from(Array(this.width), () => []);

    for (const line of validLines) {

      for (let i = 0; i < this.width; i++) {
        const start = i * 4;

        const crate = line[start + 1];

        if (crate !== ' ') {
          this.stacks[i].unshift(crate);
        }
      }
    }
  }

  move(count, source, target) {
    if (DEBUG) {
      console.log('move', count, source, target);
      console.log(this.stacks)
    }
    const sourceStack = this.stacks[source - 1];
    const targetStack = this.stacks[target - 1];


    const items = sourceStack.splice(-1 * count, count);
    targetStack.splice(targetStack.length, 0, ...items);
  }

  peekTops() {
    const result = [];

    for (const stack of this.stacks) {
      if (stack.length > 0) {
        const top = stack[stack.length - 1];
        result.push(top);
      }
    }

    return result.join('');
  }
}

function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const [rawState, rawInstructions] = input.split('\n\n').map(raw => raw.split('\n'));

  const stackGroup = new StackGroup(rawState);

  const instructions = rawInstructions.map(parseInstruction);

  for (const instruction of instructions) {
    stackGroup.move(...instruction);
  }

  return stackGroup.peekTops();
}

function test() {
  console.log(main('./input.txt'));
}

function example() {
  console.log(main('./example.txt'));
}

test();
//example();
