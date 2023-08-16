const fs = require('fs');

function halfSplit(list) {

  const midPoint = list.length / 2;

  const first = list.slice(0, midPoint);
  const second = list.slice(midPoint);

  return [first, second];
}

function findIntersection(first, second, third) {
  const itemSet1 = new Set(first.split(''));
  const itemSet2 = new Set(second.split(''));

  for (let item of third.split('')) {
    if (itemSet1.has(item) && itemSet2.has(item)) {
      return item;
    }
  }

}

function charToPriority(char) {
  const charCode = char.charCodeAt(0);

  return charCodeToPriority(charCode);
}

function charCodeToPriority(code) {
 if (code >= 97 && code <= 122) {
    return code - 96;
 } else if (code >= 65 && code <= 90) {
    return code - 38; // 65 - 38 = 27
 }
}


function sum(list) {
  let total = 0;
  for (let item of list) {
    total += item;
  }

  return total;
}

function gather(list, n) {
  let result = [];

  let pointer = 0;
  while (pointer < list.length) {
    result.push(list.slice(pointer, pointer + n));
    pointer += n;
  }

  return result;
}


function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const rucksacks = input.split('\n');

  const groups = gather(rucksacks, 3);

  console.log(groups);
  
  const badges = groups.map(group => findIntersection(...group));
  console.log(badges);

  const priorities = groups.map(group => charToPriority(findIntersection(...group)));

  return sum(priorities);

}

function test() {
  console.log(main('./input.txt'));
}

function example() {
  console.log(main('./example.txt'));
}

test();
//example();
