function mod(a, b) {
  return ((a % b) + b) % b;
}

class Game {
  constructor(playerCount, lastMarbleScore) {
    this.playerCount = playerCount;
    this.lastMarbleScore = lastMarbleScore;

    this.marbles = [0];
    this.currentPlayer = 0;
    this.scores = Array.from({ length: playerCount }).fill(0);

    this.currentMarbleIndex = 0;
    this.nextMarble = 1;
  }

  play() {
    while (true) {
      if (mod(this.nextMarble, 23) === 0) {
        this.scoreMarble();
      } else {
        this.insertMarble();
      }

      this.nextPlayer();

      if (this.nextMarble > this.lastMarbleScore) {
        return this.getMaxScore();
      }
    }
  }

  nextPlayer() {
    this.currentPlayer = mod((this.currentPlayer + 1), this.scores.length);
  }

  insertMarble() {
    const insertPoint = mod((this.currentMarbleIndex + 1), (this.marbles.length)) + 1;

    this.marbles.splice(insertPoint, 0, this.nextMarble);

    this.currentMarbleIndex = mod((insertPoint), this.marbles.length);
    this.nextMarble += 1;
  }

  scoreMarble() {
    const removalPoint = mod((this.currentMarbleIndex - 7), this.marbles.length);

    const score = this.nextMarble + this.marbles[removalPoint];

    this.scores[this.currentPlayer] += score

    this.marbles.splice(removalPoint, 1);

    this.currentMarbleIndex = mod(removalPoint, this.marbles.length);
    this.nextMarble += 1;

    return score;
  }

  getMaxScore() {
    let max = -Infinity;
    for (let i = 0; i < this.scores.length; i++) {
      if (this.scores[i] > max) {
        max = this.scores[i];
      }
    }

    return max;
  }
}


function solution(players, lastMarbleScore) {
  const g = new Game(players, lastMarbleScore);

  console.log(g.play());
}

function testExample() {
  const g = new Game(13, 7999);

  console.log(g.play());
}


solution(405, 70953*100);
