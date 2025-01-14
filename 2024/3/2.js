const fs = require('fs');



const mulRegexp = /(?:(do)\(\)|(don't)\(\)|(mul)\((\d{1,3}),(\d{1,3})\))/g;





function main(filename) {
  const input = fs.readFileSync(filename, 'utf8');

  let sum = 0;

  let isEnabled = true;

  for (const match of input.matchAll(mulRegexp)) {

    if (!match) {
      break;
    }

    const [full, doCommand, dontCommand, mulCommand, first, second] = match;

    const command = doCommand || dontCommand || mulCommand;

    if (command === "do") {
      isEnabled = true;
    } else if (command === "don't") {
      isEnabled = false;
    } else if (command === "mul") {
      if (isEnabled) {
        const product = parseInt(first, 10) * parseInt(second, 10);

        sum += product;
      }
    }
  }

  return sum;
}

function test() {
  console.log(main('./input.txt'));
}

function testExample() {
  console.log(main('./example.txt'));
}

function testExample2() {
  console.log(main('./example2.txt'));
}

test();
  //testExample();
  //testExample2();
