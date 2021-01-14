const fs = require('fs');


function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');
  const groups = input.split('\n\n').map(x => x.split('\n'));

  let total = 0;
  for (const group of groups) {
    const answers = new Set();

    for (const person of group) {
      for (const answer of person.split('')) {
        answers.add(answer);
      }
    }

    total += answers.size;
  }
  return total;
}

function test() {
  console.log(main());
}

test();
