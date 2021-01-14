const fs = require('fs');


const DEBUG=true;



const POSITION_REGEX = /<x=(.+), y=(.+), z=(.+)>/
function parsePosition(posText) {
  const positionMatch = posText.match(POSITION_REGEX);
  if (!positionMatch) {
    throw new Error(`error parsing position: ${posText}`);
  }

  const [fullMatch, x, y, z] = positionMatch;

  return [x, y, z].map(n => Number(n));

}

function addVectors(v1, v2) {
  const result = [];
  for (let i = 0; i < v1.length; i++) {
    result.push(v1[i] + v2[i]);
  }

  return result;
}

function invertVector(v1) {
  return v1.map(n => -1 * n);
}

function sum(vector) {
  let total = 0;
  for (const elem of vector) {
    total += elem;
  }
  return total;
}

function serializeVector(vector) {
  const [x, y, z] = vector.map(n => String(n).padStart(3, ' '));
  return `<x=${x}, y=${y}, z=${z}`
}

class GravityBody {
  constructor(position) {
    this.position = position;
    this.velocity = [0, 0, 0];
  }

  update() {
    for (const [i, velocity] of this.velocity.entries()) {
      this.position[i] += velocity;
    }
  }

  applyGravity(gravity) {
    this.velocity = addVectors(this.velocity, gravity);
  }

  applyAntiGravity(gravity) {
    this.applyGravity(invertVector(gravity));
  }

  potentialEnergy() {
    return sum(this.position.map(n => Math.abs(n)));
  }

  kineticEnergy() {
    return sum(this.velocity.map(n => Math.abs(n)));
  }

  totalEnergy() {
    return this.potentialEnergy() * this.kineticEnergy();
  }

  logEnergy() {
    console.log(`pot=${this.potentialEnergy()}, kin=${this.kineticEnergy()}, total=${this.totalEnergy()}`)
  }

  logState() {
    console.log(this.serialize())
  }

  serialize() {
    return `pos=${serializeVector(this.position)}, vel=${serializeVector(this.velocity)}`;
  }
}

class GravitySystem {
  constructor(moons) {
    this.moons = moons.map(item => new GravityBody(item));
  }

  update() {
    for (let i = 0; i < this.moons.length - 1; i++) {
      for (let j = i; j < this.moons.length; j++) {
        const moonOne = this.moons[i];
        const moonTwo = this.moons[j];

        const gravity = this.gravityBetween(moonOne, moonTwo);
        moonOne.applyGravity(gravity);
        moonTwo.applyAntiGravity(gravity);
      }
    }

    for (const moon of this.moons) {
      moon.update();
    }

    if(DEBUG) {
      this.logState();
    }
  }

  gravityBetween(moonOne, moonTwo) {
    const posOne = moonOne.position;
    const posTwo = moonTwo.position;

    const gravity = [0, 0, 0];
    for (let i = 0; i < posOne.length; i++) {
      if (posOne[i] < posTwo[i]) {
        gravity[i] = 1;
      } else if (posOne[i] > posTwo[i]) {
        gravity[i] = -1;
      }
    }

    return gravity;
  }

  logState() {
    for (const moon of this.moons) {
      moon.logState();
    }
  }

  totalEnergy() {
    const energies = this.moons.map(moon => moon.totalEnergy());

    return sum(energies);
  }
}


function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const moons = input.split('\n').map(parsePosition);

  const gravitySystem = new GravitySystem(moons);

  for (let i = 0; i < 1000; i++) {
    if (DEBUG) {
      console.log();
      console.log(`after ${i} steps:`);
    }
    gravitySystem.update();
  }

  if (DEBUG) {
    for (const moon of gravitySystem.moons) {
      console.log()
      moon.logEnergy();
    }
  }

  return gravitySystem.totalEnergy();
}

function test() {
  console.log(main());
}

test();
