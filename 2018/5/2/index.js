const fs = require('fs');

const INPUT = fs.readFileSync('./input.txt', 'utf8');


const EXAMPLE = `dabAcCaCBAcCcaDA`;

function isUpperCase(a) {
  return (a === a.toUpperCase());
}

function isSameUnitType(a, b) {
  return (a.toLowerCase() === b.toLowerCase());
}

function isOppositePolarity(a, b) {
  const uppercaseCount = Number(isUpperCase(a)) + Number(isUpperCase(b));

  return (uppercaseCount === 1);
}

function canAnnihilate(a, b) {
  return isSameUnitType(a, b) && isOppositePolarity(a, b);
}

function sum(list) {
  return list.reduce((acc, item) => acc + item, 0);
}

function processPolymer(input) {
  const destroyed = Array.from({ length: input.length}).fill(false);

  let index = 0;
  while(index + 1 < input.length) {
    if (!destroyed[index]) {
      for (let j = index + 1; j < input.length; j++) {
        //console.log(index, destroyed[index], input[index], j, destroyed[j], input[j])
        if (destroyed[j]) {
          continue;
        }

        if (canAnnihilate(input[index], input[j])) {
          //console.log('anihilating!');
          destroyed[index] = true;
          destroyed[j] = true;
          index = 0;
        }

        break;
      }
    }
    index += 1;
  }

  return sum(destroyed.map((x) => Number(!x)));
}

function removeUnitType(input, type) {
  const regexp = new RegExp(type, 'ig');

  return input.replace(regexp, '');
}

function findShortestWithRemoval(input) {
  const unitTypes = new Set(input.toLowerCase());

  let min = Infinity;
  for (const unitType of unitTypes) {
    const filteredPolymer = removeUnitType(input, unitType);

    const len = processPolymer(filteredPolymer);

    if (len < min) {
      min = len;
    }
  }

  return min;
}

console.log(findShortestWithRemoval(INPUT));
