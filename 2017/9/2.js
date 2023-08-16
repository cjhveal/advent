const fs = require('fs');


class GroupParser {
  constructor() {
    this.state = 'init'
    this.depth = 0;

    this.groupSum = 0;
    this.garbageSum = 0;

    this.pointer = 0;

    this.input = '';
  }

  parse(input) {
    this.input = input;

    while (this.pointer < this.input.length) {
      this.consume();
    }
  }

  handleGroupEnd() {
    this.groupSum += this.depth;
    this.depth -= 1;
    this.state = 'group-end';
  }


  consume() {
    const char = this.input[this.pointer];
    if (this.state === 'init') {
      if (char !== '{') {
        throw new Error('invalid initial char:', char);
      }

      this.depth += 1
      this.state = 'group'

    } else if (this.state === 'group') {
      if (char === '}') {
        this.handleGroupEnd();
      } else if (char === '{') {
        this.depth += 1;
        this.state = 'group';
      } else if (char === '<') {
        this.state = 'garbage';
      }

    } else if (this.state === 'group-end') {
      if (char === ',') {
        this.state = 'group';
      } else if (char === '}') {
        this.handleGroupEnd();
      } else {
        throw new Error('invalid character at group end:', char);
      }

    } else if (this.state === 'garbage') {
      if (char === '!') {
        this.pointer += 1;
      } else if (char === '>') {
        this.state = 'group-end';
      } else {
        this.garbageSum += 1;
      }
    }


    this.pointer += 1;
  }

}

function main(input) {
  const parser = new GroupParser();

  parser.parse(input);

  return parser.garbageSum;
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
  run(`{}`)
}
function example2() {
  run(`{{{}}}`);
}
function example3() {
  run(`{{<ab>},{<ab>},{<ab>},{<ab>}}`);
}
function example4() {

}
function example5() {

}

//example3();
test();
