const fs = require('fs');

function halfSplit(list) {

  const midPoint = list.length / 2;

  const first = list.slice(0, midPoint);
  const second = list.slice(midPoint);

  return [first, second];
}

function findIntersection(first, second) {
  const itemSet = new Set(first.split(''));

  for (let item of second.split('')) {
    if (itemSet.has(item)) {
      return item;
    }
  }

}

function charCodeToPriority(code) {
 if (code >= 97 && code <= 122) {
    return code - 96;
 } else if (code >= 65 && code <= 90) {
    return code - 38; // 65 - 38 = 27
 }
}


function parseRucksack(raw) {
  const [first, second] = halfSplit(raw);

  return findIntersection(first,second);
}

function sum(list) {
  let total = 0;
  for (let item of list) {
    total += item;
  }

  return total;
}


function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const items = input.split('\n').map(parseRucksack);

  const priorities = items.map(item => item.charCodeAt(0)).map(charCodeToPriority);

  return sum(priorities);

}

function test() {
  console.log(main());
}

test();
