const fs = require('fs');


const DEBUG=false;



function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const startingNumbers = input.split(',').map(x => Number(x.trim()));


  let turn = 0;

  const spokenLastMap = {};
  let lastNumber;


  for (const startingNumber of startingNumbers) {
    turn += 1;
    spokenLastMap[startingNumber] = turn;
    lastNumber = startingNumber;
  }

  while (turn < 2020) {
    turn += 1;

    const lastTimeSpoken = (spokenLastMap[lastNumber] || (turn - 1));
    const age = (turn - 1) - lastTimeSpoken;
    console.log(turn, lastNumber, lastTimeSpoken, age);
    spokenLastMap[lastNumber] = (turn - 1);
    lastNumber = age;
  }

  return lastNumber;
}

function test() {
  console.log(main());
}

test();
