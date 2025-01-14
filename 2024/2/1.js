const fs = require('fs');


function parseLine(line) {
  const report = line.split(/\s+/).map(x => parseInt(x, 10));

  return report;
}

function makeCheckPairs(fn) {
  function checkPairs(list) {
    let prev = null;

    for (const item of list) {
      if (prev !== null && !fn(prev, item)) {
        return false;
      }

      prev = item;
    }

    return true;
  }


  return checkPairs;
}

const allDecreasing = makeCheckPairs((prev, item) => prev > item);
const allIncreasing = makeCheckPairs((prev, item) => prev < item);
const checkDeltas = makeCheckPairs((prev, item) => {
  const delta = Math.abs(prev - item)

  return 0 < delta && delta <= 3;
});



function isSafe(report) {
  const isOrdered = allDecreasing(report) || allIncreasing(report);

  return isOrdered && checkDeltas(report);
}


function main(filename) {
  const input = fs.readFileSync(filename, 'utf8');

  const lines = input.trim().split('\n');

  const reports = lines.map(parseLine);


  let totalSafeReports = 0;
  for (const report of reports) {
    if (isSafe(report)) {
      totalSafeReports += 1;
    }
  }


  return totalSafeReports;
}

function test() {
  console.log(main('./input.txt'));
}

function testExample() {
  console.log(main('./example.txt'));
}

test();
//  testExample();
