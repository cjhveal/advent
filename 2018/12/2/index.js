const ExpandableArray = require('./exparr');

const EXAMPLE = `initial state: #..#.#..##......###...###

...## => #
..#.. => #
.#... => #
.#.#. => #
.#.## => #
.##.. => #
.#### => #
#.#.# => #
#.### => #
##.#. => #
##.## => #
###.. => #
###.# => #
####. => #`;

const INPUT = `initial state: #..######..#....#####..###.##..#######.####...####.##..#....#.##.....########.#...#.####........#.#.

#...# => .
##.## => .
###.. => .
.#### => .
#.#.# => .
##..# => #
..#.# => #
.##.. => #
##... => #
#..## => #
#..#. => .
.###. => #
#.##. => .
..### => .
.##.# => #
....# => .
##### => .
#.### => .
.#..# => .
#.... => .
...## => .
.#.## => .
##.#. => #
#.#.. => #
..... => .
.#... => #
...#. => #
..#.. => .
..##. => .
###.# => .
####. => .
.#.#. => .`;



const STATE_REGEX = /initial state: (.+)/;
function parseInitialState(rawState) {
  const match = rawState.match(STATE_REGEX);

  if (!match) {
    throw new Error('cannot parse initial state', rawState);
  }

  const [fullMatch, initialState] = match;

  return initialState;
}

const RULE_REGEX = /(.{5})\s+=>\s+(.)/;
function parseRule(rawRule) {
  const match = rawRule.match(RULE_REGEX);

  if (!match) {
    throw new Error('cannot parse rule', rawRule);
  }

  const [fullMatch, input, output] = match;

  return { input, output };
}

function parseInput(input) {
  const lines = input.split('\n');

  const [rawInitial, ...rawRules] = lines;

  const rules = rawRules.filter(x => x).map(parseRule);

  const initialState = parseInitialState(rawInitial);

  return { initialState, rules };
}


class PlantSystem {
  constructor(initialState, rules) {
    this.initialState = initialState;
    this.rules = rules;

    this.generation = 0;

    this.state = new ExpandableArray(initialState.split(''), '.');

    this.ruleMap = rules.reduce((acc, item) => {
      acc[item.input] = item.output;
      return acc;
    }, {});
  }

  test() {
    const ctxs = this.state.contexts();

    for (const [i, ctx] of ctxs) {
      console.log(i, ctx, this.getResult(ctx));
    }

  }

  getResult(context) {
    return this.ruleMap[context] || '.';
  }

  update() {
    const contexts = this.state.contexts();

    for (const [i, ctx] of contexts) {
      const result = this.getResult(ctx);
      this.state.set(i, result);
    }

    this.generation += 1;
  }

  print(width = 2) {
    const count = String(this.generation).padStart(width, ' ');
    const stateString = this.state.values.join('');

    console.log(`${count}: ${stateString}`);
  }

  stateString() {
    return this.state.values.join('');
  }

  getPlantSum() {
    const values = this.state.entries();

    return values.filter(([i, val]) => val === '#')
      .reduce((sum, [i]) => sum + i, 0);
  }
}

function solution(input) {
  const { initialState, rules } = parseInput(input);
  const system = new PlantSystem(initialState, rules);

  for (let i = 0; i < 50000000000; i++ ){
    system.update();
    if (i % 1000 === 0) {
      console.log(i);
    }
  }

  console.log(system.getPlantSum());
}

solution(INPUT);
