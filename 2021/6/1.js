const fs = require('fs');


class Pond {
  constructor(initialPopulation) {
    this.population = initialPopulation;
  }

  update() {
    const popSize = this.population.length;
    let spawned = 0;
    
    for (let i = 0; i < popSize; i++) {
      if (this.population[i] === 0) {
        this.population[i] = 6;
        this.population.push(8);
      } else {
        this.population[i] -= 1;
      }
    }
  }
}

function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const initialPopulation = input.split(',').map(Number);

  const pond = new Pond(initialPopulation);

  for (let i = 0; i < 80; i++) {
    pond.update();
  }

  return pond.population.length;
}

function test() {
  console.log(main('input.txt'));
}

function example() {
  console.log(main('example.txt'));
}

//example();
test();
