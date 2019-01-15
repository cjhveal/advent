function sum(ary, f) {
  return ary.reduce((acc, item) => acc + f(item), 0);
}

class Scoreboard {
  constructor(scores, limit) {
    this.scores = scores;
    this.limit = limit;

    this.elves = [0, 1];

    this.count = 0;
  }

  moveElves() {
    this.elves = this.elves.map(e => {
      const score = this.scores[e]

      const newSpot = (e + score + 1) % this.scores.length;

      return newSpot;
    });
  }

  combineScores() {
    const scoreSum = sum(this.elves, e => this.scores[e])

    const newScores = String(scoreSum).split('').map(Number);

    this.count += newScores.length;

    this.scores.push(...newScores);
  }

  run(limit) {
    while (true) {
      this.combineScores();
      this.moveElves();
      if (this.count >= this.limit + 10) {
        break;
      }
    }

    console.log(this.scores.slice(this.limit, this.limit + 10));
  }

  print() {
    for (let i = 0; i < this.scores.length; i++) {
      const n = this.scores[i];
      if (i === this.elves[0]) {
        process.stdout.write(`(${n})`);
      } else if (i === this.elves[1]) {
        process.stdout.write(`[${n}]`);
      } else {
        process.stdout.write(` ${n} `);
      }
    }
    process.stdout.write('\n');
  }
}


function solution(input, count = input) {
  const scores = String(input).split('').map(Number);

  const s = new Scoreboard(scores, count);

  s.run();
}


solution(37, 760221);

