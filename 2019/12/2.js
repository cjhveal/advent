const fs = require('fs');


const DEBUG=false;



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

function gcd2(a, b) {
  // Greatest common divisor of 2 integers
  if(!b) return b===0 ? a : NaN;
  return gcd2(b, a%b);
}
function gcd(array) {
  // Greatest common divisor of a list of integers
  let n = 0;
  for(let i=0; i < array.length; i++) {
    n = gcd2(array[i], n);
  }
  return n;
}
function lcm2(a, b) {
  // Least common multiple of 2 integers
  return a*b / gcd2(a, b);
}
function lcm(array) {
  // Least common multiple of a list of integers
  let n = 1;
  for(let i=0; i < array.length; ++i) {
    n = lcm2(array[i], n);
  }
  return n;
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
    console.log(`pos=${serializeVector(this.position)}, vel=${serializeVector(this.velocity)}`);
  }

  serializeState() {
    return [
      `${this.position[0]},${this.velocity[0]}`,
      `${this.position[1]},${this.velocity[1]}`,
      `${this.position[2]},${this.velocity[2]}`,
    ];
  }
}

class GravitySystem {
  constructor(moons) {
    this.moons = moons.map(item => new GravityBody(item));
    this.stateSets = [new Set(), new Set(), new Set()];
    this.repeatsOn = [null, null, null];
  }

  update(step) {
    this.recordState(step);

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

  serializeState() {
    return moonStates.join('|');
  }

  recordState(step) {
    const moonStates = this.moons.map(moon => moon.serializeState());

    const xStates = moonStates.map(state => state[0]).join('|');
    const yStates = moonStates.map(state => state[1]).join('|');
    const zStates = moonStates.map(state => state[2]).join('|');

    const statesByCoordinate = [xStates, yStates, zStates];
    for (let i = 0; i < 3; i++) {
      const currentState = statesByCoordinate[i];
      if (this.stateSets[i].has(currentState) && !this.repeatsOn[i]) {
        this.repeatsOn[i] = step;
      } else {
        this.stateSets[i].add(currentState);
      }
    }
  }

  hasRepeatedState() {
    return this.repeatsOn.every(Boolean);
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

  let steps = 0;
  while (true) {
    if (DEBUG) {
      console.log();
      console.log(`after ${steps} steps:`);
    }
    gravitySystem.update(steps);

    if (gravitySystem.hasRepeatedState()) {
      return lcm(gravitySystem.repeatsOn);
    }
    steps += 1;
  }


}

function test() {
  console.log(main());
}

test();
