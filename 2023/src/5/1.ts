import {readFileSync} from 'fs';

const DEBUG = false;


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

function parseSeedBlock(rawText: string): Array<number> {
  const rawNumbers = rawText.split(': ')[1];

  return parseNumberList(rawNumbers);
}

class Range {
  destStart: number;
  sourceStart: number;
  rangeSize: number;

  constructor(destStart: number, sourceStart: number, rangeSize: number) {
    this.destStart = destStart;
    this.sourceStart = sourceStart;
    this.rangeSize = rangeSize;
  }

  has(n: number) {
    return (this.sourceStart <= n && n < this.sourceStart + this.rangeSize)
  }

  convert(n: number) {
    if (!this.has(n)) {
      return n;
    }

    const delta = this.destStart - this.sourceStart;

    return n + delta;
  }

  static parse(rawRange: string): Range {
    const [destStart, sourceStart, rangeSize] = parseNumberList(rawRange);

    return new Range(destStart, sourceStart, rangeSize);
  }
}

class AlmanacMap {
  ranges: Array<Range>;

  constructor(ranges: Array<Range>) {
    this.ranges = ranges;
  }

  convert(n: number): number {
    for (const range of this.ranges) {
      if (range.has(n)) {
        return range.convert(n);
      }
    }

    return n;
  }

  static parse(rawBlock: string): AlmanacMap {
    // remove first line with map name
    const lines = rawBlock.trim().split('\n').slice(1);

    const ranges = lines.map(line => Range.parse(line));

    return new AlmanacMap(ranges);
  }
}



function main(filename: string): number {
  const input: string = readFileSync(filename, "utf8");

  const blocks = input.trim().split('\n\n');

  const [seedBlock, ...mapBlocks] = blocks;

  const seeds = parseSeedBlock(seedBlock);

  const almanacMaps = mapBlocks.map(block => AlmanacMap.parse(block));

  let minLocation = Infinity;
  for (const seed of seeds) {
    let value = seed;

    for (const map of almanacMaps) {
      value = map.convert(value);
    }

    if (value < minLocation) {
      minLocation = value;
    }
  }

  return minLocation;
}

function test() {
  console.log(main("./input.txt"));
}

function testExample() {
  console.log(main("./example.txt"));
}

test();
//testExample();
