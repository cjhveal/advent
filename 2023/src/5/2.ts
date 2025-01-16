import {readFileSync} from 'fs';

const DEBUG = false;


const WHITESPACE_REGEXP = /\s+/;
function parseNumberList(rawList: string): Array<number> {
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


type SeedRange = [number, number];

class SeedBlock {
  ranges: Array<SeedRange>

  constructor(ranges: Array<SeedRange>) {
    this.ranges = ranges;
  }

  *values(): Generator<number> {
    for (const range of this.ranges) {
      const [start, length] = range;

      for (let i = start; i < start + length; i++) {
        yield i;
      }
    }
  }

  static parse(rawBlock: string): SeedBlock {
    // parse list, remove seed: label
    const list = parseNumberList(rawBlock).slice(1);

    const ranges: Array<SeedRange> = [];
    for (let i = 0; i < list.length; i += 2) {
      const pair: SeedRange = [list[i], list[i+1]];
      ranges.push(pair);
    }

    return new SeedBlock(ranges);
  }
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

  const seedRange = SeedBlock.parse(seedBlock);

  const almanacMaps = mapBlocks.map(block => AlmanacMap.parse(block));

  let minLocation = Infinity;
  for (const seed of seedRange.values()) {
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
