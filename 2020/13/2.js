const fs = require('fs');


const DEBUG=true;


class MultipleCounter {
  constructor(base, offset) {
    this.base = base;
    this.offset = offset;
    this.value = 0;
  }

  increment() {
    this.value += this.base;
  }


  incrementBeyond(number) {
    while (this.value < number) {
      this.increment();
    }
  }

  diff(number) {
    return this.value - number;
  }

  isOffset(number) {
    return this.diff(number) === this.offset;
  }

  reset() {
    this.value = 0;
  }
}

function parseInput(input) {
  const [departTimeText, scheduleText] = input.split('\n');

  const departTime = Number(departTimeText);
  const schedule = scheduleText.split(',')
    .map((item, index) => ({ number: item === 'x' ? null : Number(item), offset: index}) )
    .filter(item => item.number)
    .sort((a, b) => a.offset - b.offset);

  return { departTime, schedule };
}

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');
  
  const { departTime, schedule } = parseInput(input);

  const counters = schedule.map(item => new MultipleCounter(item.number, item.offset));

  let timestamp = 100000000000000-1;

  timestampLoop:
  while (true) {
    timestamp += 1;
    console.log(timestamp);

    for (const counter of counters) {
      counter.incrementBeyond(timestamp);
      if (!counter.isOffset(timestamp)) {
        continue timestampLoop;
      }
    }
    
    break;
  }


  return timestamp;
}

function test() {
  console.log(main());
}

test();
