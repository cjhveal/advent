const fs = require('fs');


const DEBUG=true;


const DIRECTIONS = {
  w: {q: -1, r: 0},
  e: {q: 1, r: 0},
  nw: {q: 0, r: -1},
  sw: {q: -1, r: 1},
  ne: {q: 1, r: -1},
  se: {q: 0, r: 1},
};


function hexNeighbor(hex, direction) {
  const dirVector = DIRECTIONS[direction];
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

function sum(array) {
  let total = 0;

  for (const item of array) {
    total += Number(item);
  }
  return total;
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
    const [q, r] = hexText.split(',').map(Number);
    return {q, r};
  }

  get(hex) {
    return this.tileMap.get(this.serialize(hex)) || TILE_WHITE;
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

  neighbors(hex) {
    return Object.keys(DIRECTIONS).map(direction => hexNeighbor(hex, direction));
  }

  getNeighbors(hex) {
    return this.neighbors(hex).map(neighbor => this.get(neighbor));
  }

  getRange() {
    let minQ = Infinity;
    let maxQ = -Infinity;
    let minR = Infinity;
    let maxR = -Infinity;

    for (const hexKey of this.tileMap.keys()){
      const hex = this.deserialize(hexKey);

      if (hex.q < minQ) {
        minQ = hex.q
      }

      if (hex.q > maxQ) {
        maxQ = hex.q;
      }

      if (hex.r < minR) {
        minR = hex.r;
      }

      if (hex.r > maxR) {
        maxR = hex.r;
      }
    }

    return {minQ, maxQ, minR, maxR};
  }

  evolve() {
    const nextTileMap = new Map();
    const range = this.getRange();
    const {minQ, maxQ, minR, maxR} = range;

    for (let q = minQ - 1; q <= maxQ + 1 ; q++) {
      for (let r = minR - 1; r <= maxR + 1; r++) {
        const hex = {q, r};
        const value = this.get(hex);
        const neighbors = this.getNeighbors(hex);

        const blackCount = sum(neighbors);

        const hexKey = this.serialize(hex);
        if (value === TILE_BLACK && (blackCount === 0 || blackCount > 2)) {
          nextTileMap.set(hexKey, TILE_WHITE);
        } else if (value === TILE_WHITE && blackCount === 2) {
          nextTileMap.set(hexKey, TILE_BLACK);
        } else {
          nextTileMap.set(hexKey, value);
        }
      }
    }

    this.tileMap = nextTileMap;
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
  if (DEBUG) {
    console.log(`Initial: ${tileBank.countBlackTiles()}`);
  }

  for (let day = 1; day <= 100; day++) {
    tileBank.evolve();
    if (DEBUG) {
      const dayText = String(day).padStart(3, ' ');
      console.log(`Day ${dayText}: ${tileBank.countBlackTiles()}`);
    }
  }


  return tileBank.countBlackTiles();
}

function test() {
  console.log(main());
}

test();
