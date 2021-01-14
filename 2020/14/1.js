const fs = require('fs');


const DEBUG=false;




class MaskMemory {
  constructor() {
    this.setMask = BigInt(0);
    this.unsetMask = BigInt(0);

    this.memory = {};
  }
  
  changeMask(newMask) {
    const chars = newMask.split('');
    const setMaskText = chars.map(char => char === '1' ? '1' : '0').join('');
    const unsetMaskText = chars.map(char => char === '0' ? '0' : '1').join('');

    this.setMask = BigInt(`0b${setMaskText}`);
    this.unsetMask = BigInt(`0b${unsetMaskText}`);
  }


  mask(value) {
    const maskedValue =  (BigInt(value) | this.setMask) & this.unsetMask;

    if (DEBUG) {
      console.log(value, maskedValue);
    }

    return maskedValue
  }

  set(target, value) {
    this.memory[target] = this.mask(value);
  }

  sum() {
    let total = BigInt(0);
    for (const entry of Object.values(this.memory)) {
      total += entry;
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

  return memory.sum();

}

function test() {
  console.log(main());
}

test();
