const fs = require('fs');

const DEBUG = false;

class RingValidator {
  constructor(size) {
    this.size = size;

    this.reset();
  }

  reset() {
    this.buffer = Array(this.size).fill('');
    this.ringPointer = 0;

  }

  add(char) {
    this.buffer[this.ringPointer] = char;

    this.ringPointer += 1;

    this.ringPointer = (this.ringPointer % this.size);
  }

  validate() {
    if (DEBUG) {
      console.log('validate', this.buffer);
    }
    const charSet = new Set();

    for (const char of this.buffer) {
      if (charSet.has(char)) {
        return false;
      }

      charSet.add(char);
    }

    return true;
  }

  findMarker(input) {
    this.reset();

    for (let i = 0; i < input.length; i++) {
      this.add(input[i]);
      if (i >= 3 && this.validate()) {
        return i;
      }
    }
  }
}


function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');


  const validator = new RingValidator(14);

  return validator.findMarker(input) + 1;

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
