const fs = require('fs');


const ruleRegexp = /(.+)\s+bags\s+contain\s+(.+)\./;
const subruleRegexp = /(\d+)\s+(.+)\s+bags?/

const parseRule = (rule) => {
  const match = rule.match(ruleRegexp);
  if (!match) {
    return;
  }

  const [fullMatch, color, subrules] = match;

  const contents = subrules.split(',').map(parseSubrule);

  return [color, contents]
}

const parseSubrule = (inputSubrule) => {
  const subrule = inputSubrule.trim();
  if (subrule === 'no other bags') {
    return null;
  }

  const match = subrule.match(subruleRegexp);
  if (!match) {
    return;
  }

  const [fullMatch, count, color] = match;

  return [color, count];
}


function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');
  const lines = input.split('\n');

  const rules = lines.map(parseRule);
  const rulesMap = new Map(rules);

  const canCarryMap = new Map();
  const target = 'shiny gold';

  const checkItem = ([color, count]) => {
    if (color === target || canCarryMap.get(color)) {
      return true;
    }
  }

  const checkContents = (contents) => {
    for (const item of contents) {
      if (!item) {
        continue;
      }
      const [subColor, count] = item;
      if (subColor === target || canCarryMap.get(subColor)) {
        return true;
      } else {
        const subContents = rulesMap.get(subColor);
        if (checkContents(subContents)) {
          return true;
        }
      }
    }
  }

  for (const rule of rulesMap) {
    const [color, contents] = rule;
    console.log(color, contents);
    
    if (checkContents(contents)) {
      
    }
  }


  return canCarryMap.size;
}

function test() {
  console.log(main());
}

test();
