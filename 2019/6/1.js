const fs = require('fs');


function getTotalOrbits(item, childrenMap, totalOrbits) {
  if (totalOrbits.has(item)) {
    return totalOrbits.get(item);
  }

  const children = childrenMap.get(item);

  let total = children ? children.size : 0;

  if (children) {
    for (const child of children) {
      total += getTotalOrbits(child, childrenMap, totalOrbits);
    }
  }
  console.log(item, total);

  totalOrbits.set(item, total);
  return total;
}

function main() {
  const input = fs.readFileSync('./example.txt', 'utf8');

  const orbits = input.split('\n').map(line => line.split(')'));

  const childrenMap = new Map();

  for (const orbit of orbits) {
    const [planet, moon] = orbit;

    const planetChildren = childrenMap.get(planet) || new Set();
    planetChildren.add(moon);
    childrenMap.set(planet, planetChildren);
  }

  let directOrbitCount = 0;

  for (const children of childrenMap.values()) {
    directOrbitCount += children.size;
  }

  const totalOrbitMap = new Map();


  return getTotalOrbits('COM', childrenMap, totalOrbitMap);

  return;
}

function test() {
  console.log(main());
}

test();
