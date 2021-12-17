const fs = require('fs');


function polymerize(polymer, rules) {
  let nextPolymer = '';
  for (let i = 0; i < polymer.length - 1; i++) {
    let pair = polymer[i] + polymer[i+1];
    const insertion = rules[pair];
    nextPolymer += polymer[i] + insertion;
  }

  nextPolymer += polymer[polymer.length - 1];

  return nextPolymer;
}


function countElements(polymer) {
  const totals = {};
  for (let i = 0; i < polymer.length; i++) {
    const elem = polymer[i];
    totals[elem] = totals[elem] || 0;
    totals[elem] += 1
  }

  return totals;
}


const STEP_COUNT = 10;
function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const [template, rawRules] = input.trim().split('\n\n');

  const rules = rawRules.trim().split('\n').reduce((acc, rawRule) => {
    const [source, target] = rawRule.trim().split(' -> ');
    acc[source] = target;

    return acc;
  }, {});

  let polymer = template;
  for (let i = 0; i < STEP_COUNT; i++) {
    polymer = polymerize(polymer, rules);
  }

  const totals = countElements(polymer)
  const sortedTotals = Object.values(totals).sort((a,b) => b -a);
  
  return sortedTotals[0] - sortedTotals[sortedTotals.length - 1];
}

function test() {
  console.log(main('input.txt'));
}

function example() {
  console.log(main('example.txt'));
}

//example();
test();
