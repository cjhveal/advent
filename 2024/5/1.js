const fs = require('fs');

const DEBUG = false;

function parseRule(rawRule) {
  return rawRule.trim().split('|').map(x => parseInt(x, 10));
}

function parseUpdate(rawUpdate) {
  return rawUpdate.trim().split(',').map(x => parseInt(x, 10));
}

class Rule {
  constructor(baseRule) {
    this.baseRule = baseRule;

    this.reset();
  }

  reset() {
    this.hasX = false;
    this.hasY = false;
    this.activeX = false;
    this.activeY = false;
  }

  activateIfMatching(n) {
    const [x, y] = this.baseRule;

    if (n === x) {
      this.activeX = true;
    }

    if (n === y) {
      this.activeY = true;
    }
  }

  isActive() {
    return this.activeX && this.activeY;
  }

  markPage(n) {
    const [x, y] = this.baseRule;

    if (n === x) {
      this.hasX = true;
    }

    if (n === y) {
      this.hasY = true;
    }

    if (DEBUG) {
      console.log(x, y, n, this.isViolated());
    }
  }


  isViolated() {
    return this.isActive() && (this.hasY && !this.hasX);
  }
}

class RuleSet {
  constructor(baseRules) {
    this.baseRules = baseRules;

    this.rules = baseRules.map(baseRule => new Rule(baseRule));
  }

  reset() {
    for (const rule of this.rules) {
      rule.reset();
    }
  }

  markPage(n) {
    for (const rule of this.rules) {
      rule.markPage(n);
    }
  }

  isViolated() {
    return this.rules.some((rule) => rule.isViolated());
  }

  activateRulesFor(page) {
    for (const rule of this.rules) {
      rule.activateIfMatching(page);
    }
  }
}

function getMiddlePage(pages) {
  const middleIndex = Math.floor(pages.length/2);

  return pages[middleIndex];
}


function main(filename) {
  const input = fs.readFileSync(filename, 'utf8');

  const [rawRules, rawUpdates] = input.trim().split('\n\n');

  const baseRules = rawRules.trim().split('\n').map(parseRule);
  const ruleSet = new RuleSet(baseRules);

  const updates = rawUpdates.trim().split('\n').map(parseUpdate);


  let middlePageSum = 0;
  updateLoop:for (const currentUpdate of updates) {
    if (DEBUG) {
      console.log('******');
      console.log(currentUpdate);
    }
    ruleSet.reset();


    // enable rulesets that contain at least one page of the update
    for (const currentPage of currentUpdate) {
      ruleSet.activateRulesFor(currentPage);
    }


    for (const currentPage of currentUpdate) {
      ruleSet.markPage(currentPage);

      if (ruleSet.isViolated()) {
        continue updateLoop;
      }
    }

    // no page violated rules
    const middle = getMiddlePage(currentUpdate);

    middlePageSum += middle;
  }

  return middlePageSum;;
}

function test() {
  console.log(main('./input.txt'));
}

function testExample() {
  console.log(main('./example.txt'));
}

test();
//testExample();
