import {readFileSync} from 'fs';

const DEBUG = false;

type ScratchCard = {
  id: number,
  winningNumbers: Array<number>,
  revealedNumbers: Array<number>,
};

const WHITESPACE_REGEXP = /\s+/;
function parseNumberList(rawList: string) {
  if(DEBUG) {
    console.log(rawList);
  }
  return rawList.trim().split(WHITESPACE_REGEXP).map(word => {
    if(DEBUG) {
      console.log(word, parseInt(word, 10));
    }

    return parseInt(word, 10);
  })
}

function parseScratchCard(text: string): ScratchCard {
  const [gameName, numbersText] = text.split(': ');

  const [winningText, revealedText] = numbersText.split(' | ');

  const winningNumbers = parseNumberList(winningText);
  const revealedNumbers = parseNumberList(revealedText);

  return {
    id: 0,
    winningNumbers,
    revealedNumbers
  }
}

function scoreScratchCard(card: ScratchCard): number {
  const winningSet = new Set(card.winningNumbers);

  if (DEBUG) {
    console.log('***')
    console.log(card.winningNumbers);
    console.log(card.revealedNumbers);
  }
  let totalMatches = 0;
  for (const number of card.revealedNumbers) {
    if (winningSet.has(number)) {
      totalMatches += 1;
    }
  }

  if (totalMatches === 0) {
    return 0;
  } else {
    return Math.pow(2, totalMatches - 1);
  }
}


function main(filename: string): number {
  const input: string = readFileSync(filename, "utf8");

  const scratchCards = input.trim().split('\n').map(parseScratchCard);

  let total = 0;
  for (const card of scratchCards) {
    total += scoreScratchCard(card);
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
