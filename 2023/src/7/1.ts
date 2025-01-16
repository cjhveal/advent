import {readFileSync} from 'fs';

const DEBUG = false;



enum HandRank {
  HighCard,
  OnePair,
  TwoPair,
  ThreeOAK,
  FullHouse,
  FourOAK,
  FiveOAK,
};

const CARD_RANKS = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'T',
  'J',
  'Q',
  'K',
  'A',
] as const;

type CardRank = typeof CARD_RANKS[number];

type Hand = {
  cards: CardRank[],
  handRank: HandRank,
  bid: number,
}

const cardRankMap: Map<CardRank, number> = new Map();
for (const [i, card] of CARD_RANKS.entries()) {
  cardRankMap.set(card, i);
}

function getHandRank(hand: CardRank[]): HandRank {
  const handMap: Map<CardRank, number> = new Map();

  for (const card of hand) {
    const prevValue = handMap.get(card) || 0;

    handMap.set(card, prevValue + 1);
  }

  const handCounts = [...handMap.values()]
  handCounts.sort((a,b) => b-a);

  if (handCounts[0] === 5) {
    return HandRank.FiveOAK;
  } else if (handCounts[0] === 4) {
      return HandRank.FourOAK;
  } else if (handCounts[0] === 3 && handCounts[1] === 2) {
    return HandRank.FullHouse;
  } else if (handCounts[0] === 3) {
    return HandRank.ThreeOAK;
  } else if (handCounts[0] === 2 && handCounts[1] === 2) {
    return HandRank.TwoPair;
  } else if (handCounts[0] === 2) {
    return HandRank.OnePair;
  } else {
    return HandRank.HighCard;
  }
}

function compareCardRanks(cardsOne: CardRank[], cardsTwo: CardRank[]): number {
  for (const [i, cardOne] of cardsOne.entries()) {
    const cardTwo = cardsTwo[i];

    const rankOne = cardRankMap.get(cardOne)
    const rankTwo = cardRankMap.get(cardTwo)

    if (rankOne < rankTwo) {
      return -1;
    } else if (rankOne > rankTwo) {
      return 1;
    }
  }

  // all ranks matched
  return 0;
}

function compareHands(handOne: Hand, handTwo: Hand): number {
  if (handOne.handRank < handTwo.handRank) {
    return -1;
  } else if (handOne.handRank > handTwo.handRank) {
    return 1;
  }

  return compareCardRanks(handOne.cards, handTwo.cards);
}

function parseCardRank(char: string): CardRank {
  const rank = CARD_RANKS.find(c => c === char);

  if (rank) {
    return rank;
  }

  throw new Error(`INVALID CARD RANK: ${char}`);
}

const WHITESPACE_REGEXP = /\s+/;
function parseHand(rawHand: string): Hand {
  const [rawCards, rawBid] = rawHand.split(WHITESPACE_REGEXP);

  const bid = parseInt(rawBid, 10);

  const cards: CardRank[] = [];

  for (let i = 0; i < rawCards.length; i++) {
    const char = rawCards[i];

    const card = parseCardRank(char);
    cards.push(card);
  }

  const handRank = getHandRank(cards);


  return {
    cards,
    handRank,
    bid,
  }
}


function main(filename: string): number {
  const input: string = readFileSync(filename, "utf8");

  const hands = input.trim().split('\n').map(parseHand);
  
  hands.sort(compareHands);


  let total = 0;

  for (const [i, hand] of hands.entries()) {
    const finalRank = i + 1;
    const winnings = finalRank * hand.bid;
    console.log(finalRank, hand.cards.join(''), winnings);
    total += winnings;
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
