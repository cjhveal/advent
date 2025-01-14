const fs = require("fs");

const DEBUG = false;

class GameResult {
  red: number;
  blue: number;
  green: number;

  constructor(r: number, g: number, b: number) {
    this.red = r;
    this.green = g;
    this.blue = b;
  }

  static PULL_REGEXP = /(\d+) (red|green|blue)/;

  static parse(resultText: string): GameResult {
    const pulls = {
      red: 0,
      green: 0,
      blue: 0,
    };

    const rawPulls = resultText.split(", ");

    for (const rawPull of rawPulls) {
      const pullMatch = rawPull.match(this.PULL_REGEXP);

      if (!pullMatch) {
        throw new Error("invalid game result");
      }

      const [fullMatch, rawNumber, color] = pullMatch;
      if (color !== "red" && color !== "green" && color !== "blue") {
        throw new Error("invalid game result");
      }

      pulls[color] = parseInt(rawNumber, 10);
    }

    return new GameResult(pulls.red, pulls.green, pulls.blue);
  }

  isResultValid(maxR: number, maxG: number, maxB: number) {
    if (DEBUG) {
      console.log(this.red, maxR, this.green, maxG, this.blue, maxB);
    }

    return (
      this.red <= maxR
      && this.green <= maxG
      && this.blue <= maxB
    )
  }
}

class Game {
  id: number;

  results: Array<GameResult>;

  constructor(id: number, results: Array<GameResult>) {
    this.id = id;
    this.results = results;
  }

  static GAME_REGEXP = /Game (\d+)/;

  static parse(gameText: string): Game {
    const [rawGame, rawResults] = gameText.split(": ");

    const gameMatch = rawGame.match(this.GAME_REGEXP);

    if (!gameMatch) {
      throw new Error("invalid game format");
    }

    const gameId = parseInt(gameMatch[1], 10);

    const resultTexts = rawResults.split("; ");

    const results = resultTexts.map((resultText) =>
                                    GameResult.parse(resultText)
                                   );

                                   return new Game(gameId, results);
  }


  isGameValid(maxR: number, maxG: number, maxB: number) {
    if (DEBUG) {
      console.log()
      console.log(this.id)
    }

    return this.results.every(result => result.isResultValid(maxR, maxG, maxB));
  }
}

const MAX_RESULTS: [number, number, number] = [12, 13, 14];

function main(filename: string) {
  const input: string = fs.readFileSync(filename, "utf8");

  const rawGames = input.trim().split('\n');

  const games = rawGames.map((rawGame) => {
    return Game.parse(rawGame);
  });


  let total = 0;
  for (const game of games) {
    if (game.isGameValid(...MAX_RESULTS)) {
      total += game.id;
    }
  }

  return total;
}

function test() {
  console.log(main("./input.txt"));
}

function testExample() {
  console.log(main("./example.txt"));
}

test();
//testExample();
