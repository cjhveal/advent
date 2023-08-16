const fs = require('fs');

const symbolScores = {
  A: 1, B: 2, C: 3,
  X: 1, Y: 2, Z: 3,
}

const matchScores = {
  A: {
    X: 3,
    Y: 6,
    Z: 0,
  },
  B: {
    X: 0,
    Y: 3,
    Z: 6,
  },
  C: {
    X: 6,
    Y: 0,
    Z: 3,
  }
}

const matchResponses = {
  A: {
    X: 'Z',
    Y: 'X',
    Z: 'Y',
  },
  B: {
    X: 'X',
    Y: 'Y',
    Z: 'Z',
  },
  C: {
    X: 'Y',
    Y: 'Z',
    Z: 'X',
  }
}


function scoreRound(round) {
  const [first, second] = round;

  const response = matchResponses[first][second];

  return symbolScores[response] + matchScores[first][response];
}

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const rounds = input.split('\n').map(r => r.split(' '));


  let totalScore = 0;

  for (let round of rounds) {
    totalScore += scoreRound(round);
  }

  return totalScore;

}

function test() {
  console.log(main());
}

test();
