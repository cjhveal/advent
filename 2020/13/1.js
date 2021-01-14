const fs = require('fs');


const DEBUG=true;


class MultipleCounter {
  constructor(base) {
    this.base = base;
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
}

function parseInput(input) {
  const [departTimeText, scheduleText] = input.split('\n');

  const departTime = Number(departTimeText);
  const schedule = scheduleText.split(',')
    .filter(item => item !== 'x')
    .map(Number)
    .sort((a, b) => a - b);

  return { departTime, schedule };
}

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');
  
  const { departTime, schedule } = parseInput(input);


  const counters = schedule.map(id => new MultipleCounter(id));


  let minCounter;
  for (const counter of counters) {
    counter.incrementBeyond(departTime);

    if (!minCounter || (counter.diff(departTime) < minCounter.diff(departTime))) {
      minCounter = counter;
    }
  }

  return minCounter.base * minCounter.diff(departTime);
}

function test() {
  console.log(main());
}

test();
