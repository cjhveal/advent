const fs = require('fs');

const DEBUG = true;

const PROGRAM_COUNT = 16;


class ProgramList {
  constructor(size = PROGRAM_COUNT) {
    this.programs = [...new Array(size)].map((x, i) => String.fromCharCode(97 + i))

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
    console.log(this.toString());
    console.log(opcode, args);
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

  for (const move of danceMoves) {
    list.execute(...move);
  }

  return list.toString();
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

//example1();
test();
