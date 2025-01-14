const fs = require('fs');


function parseLine(line) {
  const report = line.split(/\s+/).map(x => parseInt(x, 10));

  return report;
}

function makeCheckPairs(fn) {
  function checkPairs(list, start = 0, allowFaults = true) {
    let hasFault = !allowFaults;
    let prev = list[start];

    for (let i = start+1; i < list.length; i++) {
      const item = list[i];

      if (prev !== null && !fn(prev, item)) {
        if (hasFault) {
          return false;
        } else {
          hasFault = true;
          continue;
        }
      }

      prev = item;
    }

    return true;
  }


  return (list) => {
    return checkPairs(list) || checkPairs(list, 1, false);
  }
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
    } else {
      console.log(report);
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
  testExample();
