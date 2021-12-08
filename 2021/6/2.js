const fs = require('fs');


class Pond {
  constructor(initialPopulation) {
    this.lifecycles = [0,0,0,0,0,0,0,0,0];

    for (const age of initialPopulation) {
      this.lifecycles[age] += 1;
    }
    
    console.log(this.lifecycles);
  }

  update() {
    console.log(this.lifecycles);
    const spawned = this.lifecycles[0];

    for (let i = 1; i < this.lifecycles.length; i++) {
      this.lifecycles[i-1] = this.lifecycles[i]
    }

    this.lifecycles[6] += spawned;
    this.lifecycles[8] = spawned;
  }

  total() {
    let total = 0;
    for (const stage of this.lifecycles) {
      total += stage;
    }

    return total;
  }
    
}

function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const initialPopulation = input.split(',').map(Number);

  const pond = new Pond(initialPopulation);

  for (let i = 0; i < 256; i++) {
    pond.update();
  }

  return pond.total();
}

function test() {
  console.log(main('input.txt'));
}

function example() {
  console.log(main('example.txt'));
}

//example();
test();
