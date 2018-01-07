import fs from 'fs';
const data = fs.readFileSync('./data')
const lines = data.toString().split('\n');

const reindeer = [];

const parseRegex = /(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds./
function parseReindeer(input) {
  if (!input) return;
  const match = input.match(parseRegex);
  if (!match) throw new Error('error parsing:', input);

  const [full, name, flySpeed, flyTime, restTime] = match;

  return {name,
    flySpeed: +flySpeed,
    flyTime: +flyTime,
    restTime: +restTime,
    resting: false,
    flyRemaining: +flyTime,
    restRemaining: 0,
    distance: 0,
    score: 0
  }
}



function simulateReindeer(reindeer) {
  if (reindeer.resting) {
    reindeer.restRemaining -= 1;
    if (reindeer.restRemaining <= 0) {
      reindeer.flyRemaining = reindeer.flyTime;
      reindeer.resting = false;
    }
  } else {
    reindeer.flyRemaining -= 1;
    reindeer.distance += reindeer.flySpeed;
    if (reindeer.flyRemaining <= 0) {
      reindeer.restRemaining = reindeer.restTime;
      reindeer.resting = true
    }
  }
}

function scoreTick(reindeer) {
  const leaderDistance = Math.max.apply(null, reindeer.map(r => r.distance));
  reindeer.forEach(r => {
    if (r.distance === leaderDistance) {
      r.score += 1;
    }
  })
}

function simulateRace(time) {
  let remaining = time;
  while (remaining > 0) {
    reindeer.forEach(simulateReindeer)
    scoreTick(reindeer)
    remaining -= 1;
  }
  console.log(reindeer);

  return Math.max.apply(null, reindeer.map(r => r.score))
}


lines.forEach(line => {
  if (!line) return;
  reindeer.push(parseReindeer(line));
});


console.log(simulateRace(2503))


