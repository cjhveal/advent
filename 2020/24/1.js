const fs = require('fs');


const DEBUG=false;


const directions = {
  w: {q: -1, r: 0},
  e: {q: 1, r: 0},
  nw: {q: 0, r: -1},
  sw: {q: -1, r: 1},
  ne: {q: 1, r: -1},
  se: {q: 0, r: 1},
};


function hexNeighbor(hex, direction) {
  const dirVector = directions[direction];
  return {q: hex.q + dirVector.q, r: hex.r + dirVector.r};
}

function parseDirectionSequence(directionText) {
  let result = [];

  let textBuffer = directionText;

  for (let i = 0; i < textBuffer.length; i++) {
    if (textBuffer[i] === 'n' || textBuffer[i] === 's') {
      result.push(textBuffer[i] + textBuffer[i+1]);
      i += 1;
    } else {
      result.push(textBuffer[i]);
    }
  }

  return result;

}

const TILE_BLACK = 1;
const TILE_WHITE = 0;

class HexTileBank {
  constructor() {
    this.tileMap = new Map();
  }

  serialize(hex) {
    const {q, r} = hex;
    return `${q},${r}`;
  }

  deserialize(hexText) {
    const [q, r] = hexText.split(',');
    return {q, r};
  }

  get(hex) {
    return this.tileMap.get(this.serialize(hex));
  }


  flip(hex) {
    const value = this.get(hex);
    const hexKey = this.serialize(hex);

    if (!value || value === TILE_WHITE) {
      this.tileMap.set(hexKey, TILE_BLACK);
    } else {
      this.tileMap.set(hexKey, TILE_WHITE);
    }
  }

  size() {
    return this.tileMap.size;
  }

  countBlackTiles() {
    let total = 0;

    for (const tile of this.tileMap.values()) {
      if (tile === TILE_BLACK) {
        total += 1;
      }
    }

    return total;
  }
}

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');


  const tileFlips = input.split('\n').map(parseDirectionSequence);

  const tileBank = new HexTileBank();

  for (const flipSequence of tileFlips) {
    let hexPoint = {q: 0, r: 0};
    for (const direction of flipSequence) {
      hexPoint = hexNeighbor(hexPoint, direction);
    }


    tileBank.flip(hexPoint);
  }

  return tileBank.countBlackTiles();
}

function test() {
  console.log(main());
}

test();
