const fs = require('fs');


function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');
  const groups = input.split('\n\n').map(x => x.split('\n'));

  let total = 0;
  for (const group of groups) {
    const answers = {};

    for (const person of group) {
      for (const answer of person.split('')) {
        let prevAnswer = answers[answer] || 0;
        answers[answer] = prevAnswer + 1;
      }
    }

    let answerCount = 0;
    for (const answer of Object.keys(answers)) {
      const count = answers[answer];
      if (count === group.length) {
        answerCount += 1;
      }
    }

    total += answerCount;
  }
  return total;
}

function test() {
  console.log(main());
}

test();
