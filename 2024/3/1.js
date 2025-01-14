const fs = require('fs');



const mulRegexp = /mul\((\d{1,3}),(\d{1,3})\)/g;





function main(filename) {
  const input = fs.readFileSync(filename, 'utf8');

  let sum = 0;

  for (const match of input.matchAll(mulRegexp)) {

    if (!match) {
      break;
    }

    const [full, first, second] = match;

    const product = parseInt(first, 10) * parseInt(second, 10);
    console.log(first, second, '=', product);
    

    sum += product;
  }

  return sum;
}

function test() {
  console.log(main('./input.txt'));
}

function testExample() {
  console.log(main('./example.txt'));
}

test();
//  testExample();
