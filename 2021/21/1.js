const fs = require('fs');

class Die {
  constructor() {
    this.nextValue = 1;
    this.rollCount = 0;
  }

  increment() {
    this.nextValue = (this.nextValue % 100) + 1;
  }

  roll() {
    this.rollCount += 1;
    const value = this.nextValue;
    this.increment();
    return value;
  }
}

class Player {
  constructor(position) {
    this.position = position;
    this.score = 0;
  }

  turn(die) {
    const value = die.roll() + die.roll() + die.roll();

    this.position = (this.position + value - 1) % 10 + 1;
    this.score += this.position;
  }

  hasWon() {
    return this.score >= 1000;
  }
}

function parseStartingPosition(line) {
  const words = line.trim().split(' ');

  return parseInt(words[words.length - 1], 10);
}

function main(input) {
  const startingPositions = input.trim().split('\n').map(parseStartingPosition);

  const players = startingPositions.map(pos => new Player(pos));

  const die = new Die();

  while (true) {
    for (let i = 0; i < players.length; i++) {
      players[i].turn(die);
      if (players[i].hasWon()) {
        const losingPlayer = players[1-i];
        return losingPlayer.score * die.rollCount;
      }
    }
  }

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

function example() {
  runFromFile('example.txt');
}

//example();
test();
