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

  const idText = gameName.split(WHITESPACE_REGEXP)[1];
  const id = parseInt(idText, 10);

  const [winningText, revealedText] = numbersText.split(' | ');

  const winningNumbers = parseNumberList(winningText);
  const revealedNumbers = parseNumberList(revealedText);

  return {
    id,
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

  return totalMatches;
}


function main(filename: string): number {
  const input: string = readFileSync(filename, "utf8");

  const scratchCards = input.trim().split('\n').map(parseScratchCard);
  const cardCounts = Array.from({ length: scratchCards.length }, () => 1)

  for (const [i, card] of scratchCards.entries()) {
    const count = cardCounts[i];

    const cardsWon = scoreScratchCard(card);

    for (let j = i+1; j < i+cardsWon+1; j++) {
      cardCounts[j] += count;
    }
    if (DEBUG){
      console.log(cardsWon)
      console.log(cardCounts);
    }
  }

  let total = 0;
  for (const count of cardCounts) {
    total += count;
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
