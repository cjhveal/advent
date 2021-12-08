const fs = require('fs');

class BingoBoard {
  constructor(rawBoard) {
    this.board = rawBoard.split('\n').map(line => line.trim().split(/\s+/).map(Number));
    console.log(this.board);

    this.marked = Array(5).fill(false).map(x => {
      return Array(5).fill(false);
    });
  }

  markNumber(number) {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[0].length; j++) {
        if (this.board[i][j] === number) {
          this.marked[i][j] = true;
          console.log('marked', number, i, j);
          //console.log(this.marked)
        }
      }
    }
  }

  checkBoard() {
    for (let i = 0; i < this.marked.length; i++) {
      if (this.checkRow(i)) {
        return true;
      }
    }

    for (let j = 0; j < this.marked[0].length; j++) {
      if (this.checkColumn(j)) {
        return true;
      }
    }

    return false;
  }

  checkRow(row) {
    for (let j = 0; j < this.marked[0].length; j++) {
      if (!this.marked[row][j]) {
        return false;
      }
    }

    return true;
  }

  checkColumn(col) {
    for (let i = 0; i < this.marked.length; i++) {
      if (!this.marked[i][col]) {
        return false;
      }
    }

    return true;
  }

  sumUnmarked() {
    let total = 0;

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[0].length; j++) {
        if (!this.marked[i][j]) {
          total += this.board[i][j]
        }
      }
    }

    return total;
  }
}

function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const [rawNumberList, ...rawBoards] = input.split('\n\n');

  const numberList = rawNumberList.split(',').map(Number);
  const boards = rawBoards.map(b => new BingoBoard(b));

  const boardSet = new Set(boards);

  for (const number of numberList) {
    for (const board of boardSet) {
      board.markNumber(number);

      if (board.checkBoard()) {
        if (boardSet.size === 1) {
        const unmarkedTotal = board.sumUnmarked();

        return number * unmarkedTotal;
        } else {
          boardSet.delete(board);
        }
      }
    }
  }
}

function test() {
  console.log(main('input.txt'));
}

function example() {
  console.log(main('example.txt'));
}

//example();
test();
