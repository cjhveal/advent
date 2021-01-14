const fs = require('fs');


const DEBUG=false;



class MaskMemory {
  constructor() {
    this.mask = '000000000000000000000000000000000000';

    this.memory = {};
  }

  changeMask(newMask) {
    this.mask = newMask;
  }


  resolve(target) {

    const bitArray = BigInt(target).toString(2)
      .padStart(36, '0')
      .split('');


    let results = [''];
    for (let i = 0; i < this.mask.length; i++) {
      const operation = this.mask[i];

      const nextResults = [];
      for (const result of results) {
        if (operation === '0') {
          nextResults.push(result + bitArray[i]);
        } else if (operation === '1') {
          nextResults.push(result + '1');
        } else if (operation === 'X') {
          nextResults.push(result + '0');
          nextResults.push(result + '1');
        }
      }

      results = nextResults;
    }

    const decimalResults = results.map(bitString => BigInt(`0b${bitString}`).toString());

    return decimalResults;
  }

  set(target, value) {
    const allTargets = this.resolve(target);

    for (const t of allTargets) {
      this.memory[t] = value;
    }
  }

  sum() {
    let total = BigInt(0);

    for (const entry of Object.values(this.memory)) {
      total += BigInt(entry);
    }

    return total;
  }
}


const statementRegex = /(.+)\s*=\s*(.+)/;
const lhsRegex = /(mask|mem)(?:\[(\d+)\])?/;

function parseInstruction(text) {
  const statementMatch = text.match(statementRegex);

  if (!statementMatch) {
    return;
  }

  const [fullStatementMatch, lhs, rhs] = statementMatch;

  const lhsMatch = lhs.match(lhsRegex);

  if (!lhsMatch) {
    return;
  }

  const kind = lhsMatch[1];

  if (kind === 'mask') {
    return { type: 'setMask', value: rhs };
  } else if (kind === 'mem') {
    const target = lhsMatch[2];
    return { type: 'setMem', value: rhs, target };
  }
}

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const instructions = input.split('\n').map(parseInstruction);

  const memory = new MaskMemory();

  for (const instruction of instructions) {
    if (instruction.type === 'setMask') {
      memory.changeMask(instruction.value);
    } else if (instruction.type === 'setMem') {
      memory.set(instruction.target, instruction.value);
    }
  }


  return memory.sum().toString();

}

function test() {
  console.log(main());
}

test();
