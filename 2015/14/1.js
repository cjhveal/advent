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

  return {name, flySpeed: +flySpeed, flyTime: +flyTime, restTime: +restTime}
}



function simulateReindeer(reindeer, time) {
  let resting = false;
  let remaining = time;
  let distance = 0;

  while (remaining > 0) {
    if (resting) {
      remaining -= Math.min(remaining, reindeer.restTime)
    } else {
      const flown = Math.min(remaining, reindeer.flyTime);
      remaining -= flown
      distance += reindeer.flySpeed * flown
    }

    resting = !resting;
  }

  return distance;
}

function simulateRace(time) {
  const times = reindeer.map((r) => simulateReindeer(r, time))
  console.log(times);
  return Math.max.apply(null, times)
}


lines.forEach(line => {
  if (!line) return;
  reindeer.push(parseReindeer(line));
});

console.log(reindeer);

console.log(simulateRace(2503))


