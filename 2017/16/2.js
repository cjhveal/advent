const fs = require('fs');

const DEBUG = true;

const PROGRAM_COUNT = 5;

const DANCE_COUNT = 1000000000;


class ProgramList {
  constructor(size = PROGRAM_COUNT) {
    this.programs = [...new Array(size)].map((x, i) => String.fromCharCode(97 + i))
    this.initialPrograms = [...this.programs];

    this.start = 0;
  }

  resolve(i) {
    const len = this.programs.length;
    return ((i % len) + len) % len;
  }

  swap(x, y) {
    const tmp = this.programs[x];
    this.programs[x] = this.programs[y];
    this.programs[y] = tmp;
  }

  spin(n) {
    this.start = this.resolve(this.start - n);
  }

  exchange(x, y) {
    const posX = this.resolve(x + this.start);
    const posY = this.resolve(y + this.start);

    this.swap(posX, posY);
  }

  partner(a, b) {
    let posA = this.programs.indexOf(a);
    let posB = this.programs.indexOf(b);

    this.swap(posA, posB);
  }

  execute(opcode, ...args) {
    if (DEBUG) {
      console.log(this.toString());
      console.log(opcode, args);
    }

    if (opcode === 's') {
      this.spin(...args);
    } else if (opcode === 'x') {
      this.exchange(...args);
    } else if (opcode === 'p') {
      this.partner(...args);
    }
  }

  toString() {
    const base = this.programs.join('');

    return base.slice(this.start) + base.slice(0, this.start);
  }

  toArray() {
    return this.programs.slice(this.start).concat(this.programs.slice(0, this.start));
  }
}

function parseDanceMove(rawMove) {
  const opcode = rawMove[0];
  const rest = rawMove.slice(1);

  if (opcode === 's') {
    const value = parseInt(rest, 10);
    return [opcode, value];
  }

  let args = rest.split('/');

  if (opcode === 'x') {
    args = args.map(x => parseInt(x, 10));
  }

  return [opcode, ...args];
}

function main(input) {
  const danceMoves = input.split(',').map(parseDanceMove);

  const list = new ProgramList();

  let i = 0;
  for (const move of danceMoves) {
    list.execute(...move);
    i++;
    if (i>15) {
      return
    }
  }

  let result = list.toArray();

  const swapMap = list.initialPrograms.map(prog => result.indexOf(prog))
  console.log(list.initialPrograms, result);

  for (let danceCount = 1; danceCount < DANCE_COUNT; danceCount++) {
    const next = [];

    if (danceCount % 1000000 === 0) {
      console.log(danceCount);
    }

    for (let i = 0; i < result.length; i++) {
      next[i] = result[swapMap[i]];
    }

    result = next;
    console.log(result.join(''));
    return;
  }

  return result.join('');
}

function run(input) {
  console.log(main(input));
}

function runFromFile(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  run(input);
}

function test() {
  runFromFile('input.txt');
}

function example1() {
  run(`s1,x3/4,pe/b`);
}

function example2() {
}
function example3() {
}
function example4() {
}
function example5() {

}

example1();
//test();
