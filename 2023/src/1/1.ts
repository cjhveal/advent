const fs = require('fs');

const DIGIT_REGEX = /^\d$/;

function main(filename: string) {
  const input: string = fs.readFileSync(filename, 'utf8');

  const lines: string[] = input.trim().split('\n');

  let total = 0;
  for (const line of lines) {
    let firstNum: string;
    let lastNum: string;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if(DIGIT_REGEX.test(char)) {
        firstNum = char;
        break;
      }
    }

    for (let i = line.length - 1; i >= 0; i--) {
      const char = line[i];

      if(DIGIT_REGEX.test(char)) {
        lastNum = char;
        break;
      }
    }

    if (!firstNum || !lastNum) {
      throw new Error('line had no numbers');
    }

    const rawValue = `${firstNum}${lastNum}`

    const value = parseInt(rawValue, 10);

    total += value;
  }

  return total;
}


function test() {
  console.log(main('./input.txt'));
}

function testExample() {
  console.log(main('./example.txt'));
}

test();
//testExample();
