const fs = require('fs');


const DEBUG=false;

function sum(array) {
  let total = 0;

  for (const item of array) {
    total += item;
  }

  return total;
}


class Deck {
  constructor(name, cards = []) {
    this.name = name;
    this.cards = cards;
  }

  pop() {
    return this.cards.pop();
  }

  unshift(value) {
    return this.cards.unshift(value);
  }

  win(card1, card2) {
    const newCards = card1 < card2 ? [card1, card2] : [card2, card1];

    this.cards = [...newCards, ...this.cards];
  }

  size() {
    return this.cards.length;
  }

  score() {
    const cardProduct = this.cards.map((card, index) => card * (index + 1))

//    console.log(this.cards, cardProduct);
    return sum(cardProduct);
  }

  toString() {
    return this.cards.join(', ');
  }

  clone() {
    return new Deck(this.name, [...this.cards]);
  }
}

class GameObserver {
  constructor(deck1, deck2) {
    this.seenState = new Set();

    this.deck1 = deck1;
    this.deck2 = deck2;
  }

  serializeState() {
    return `${this.deck1}|${this.deck2}`;
  }

  hasSeenState() {
    const state = this.serializeState();

    return this.seenState.has(state);
  }

  record() {
    const state = this.serializeState();

    this.seenState.add(state);
  }
}


function parseDeck(text) {
  const [headerText, ...cardsText] = text.split('\n').map(t => t.trim());

  const playerName = headerText.slice(0, -1);
  const cards = cardsText.map(x => Number(x)).reverse();


  return new Deck(playerName, cards);
}


function playGame(deck1, deck2, gameObserver) {


}
  

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const decks = input.split('\n\n').map(parseDeck);

  const [player1Deck, player2Deck] = decks;

  const observer = new GameObserver(player1Deck, player2Deck);

  let round = 0;
  while (player1Deck.size() > 0 && player2Deck.size() > 0) {
    round += 1;
    if (DEBUG) {
      console.log(`-- Round ${round} --`);

      console.log(`Player 1's Deck: ${player1Deck}`);
      console.log(`Player 2's Deck: ${player2Deck}`);
    }


    const p1Card = player1Deck.pop();
    const p2Card = player2Deck.pop();

    if (DEBUG) {
      console.log(`Player 1 plays: ${p1Card}`);
      console.log(`Player 2 players: ${p2Card}`);
    }

    const winner = p1Card > p2Card ? player1Deck : player2Deck;

    if (DEBUG) {
      console.log(`${winner.name} wins the round!`);
    }

    winner.win(p1Card, p2Card);
  }

  const winningDeck = player1Deck.size() ? player1Deck : player2Deck;


  return winningDeck.score();
   
}


function test() {
  console.log(main());
}

test();
