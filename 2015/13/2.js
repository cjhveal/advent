import fs from 'fs';

const data  = fs.readFileSync('./data');
const lines = data.toString().split('\n');

const happinessMap = new Map();
const attendees = ["me"];
const happinesses = [];

const meMap = new Map();
happinessMap.set("me", meMap);

const parseRegex = /(\w+) would (gain|lose) (\d+) happiness units by sitting next to (\w+)\./;
function parseLine(input) {
  const match = input.match(parseRegex);

  if (!match) throw new Error('could not parse!', input);

  const [full, subject, direction, units, neighbor] = match;

  const sign = direction === 'lose' ? -1 : 1;

  const subjectMap = getSubjectMap(subject);
  subjectMap.set(neighbor, sign * units);
}

function getSubjectMap(subject) {
  let map = happinessMap.get(subject);
  if (!map) {
    map = new Map();
    meMap.set(subject, 0);
    map.set("me", 0);
    happinessMap.set(subject, map);
    attendees.push(subject);
  }

  return map
}

function collectPermutations(stack = []) {
  if (stack.length === attendees.length) {
    happinesses.push(calculateHappiness(stack));
    return
  }

  for (let attendee of attendees) {
    if (stack.indexOf(attendee) === -1) {
      stack.push(attendee);
      collectPermutations(stack);
      stack.pop();
    }
  }
}

function getAttendeeHappiness(i, stack) {
  const last =  stack.length - 1;
  const left = i === 0 ? last : i - 1;
  const right = i === last ? 0 : i + 1;

  const map = happinessMap.get(stack[i])

  return map.get(stack[left]) + map.get(stack[right])
}

function calculateHappiness(stack) {
  return stack.map((name, i) => getAttendeeHappiness(i, stack))
  .reduce((acc, item) => acc + item, 0)
}

function getMaxHappiness() {
  return happinesses.reduce((acc, item) => Math.max(acc, item), Number.NEGATIVE_INFINITY)
}

for (let line of lines) {
  parseLine(line);
}

collectPermutations();

console.log(getMaxHappiness())

