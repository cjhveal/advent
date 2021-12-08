const fs = require('fs');


const DEBUG=false;


const requirementRegex = /Step (\w+) .+ step (\w+)/;
function parseRequirement(text) {
  const match = text.match(requirementRegex);

  if (!match) {
    throw new Error(`cannot parse requirement: ${text}`);
  }

  const [fullMatch, parent, child] = match;

  return [parent, child];
}

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const requirements = input.split('\n').map(parseRequirement);

  const dependencies = new Map();
  for (const [parent, child] of requirements) {
    const childSet = dependencies.get(child) || new Set();

    childSet.add(parent);

    dependencies.set(child, childSet);

    if (!dependencies.has(parent)) {
      dependencies.set(parent, new Set());
    }
  }


  let sequence = '';

  const workers = [0, 0, 0, 0, 0]

  while (dependencies.size > 0) {
    const candidates = [];
    for (const [key, deps] of dependencies.entries()) {
      if (deps.size === 0) {
        candidates.push(key);
      }
    }

    candidates.sort();


    const chosen = candidates[0];
    sequence += chosen;

    for (const deps of dependencies.values()) {
      deps.delete(chosen);
    }

    dependencies.delete(chosen);
  }

  return sequence;
}

function test() {
  console.log(main());
}

test();
