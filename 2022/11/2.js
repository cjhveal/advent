const fs = require('fs');

const DEBUG = false;


function parseName(rawName) {
  // trim trailing :
  const trimmedName = rawName.slice(0, rawName.length - 1);

  const [label, name] = trimmedName.split(' ');

  return parseInt(name, 10);
}

function parseStartingItems(rawStartingItems) {
  const [label, rawItems] = rawStartingItems.split(': ');
  const items = rawItems.split(', ').map(n => parseInt(n, 10));

  return items;
}

const multiply = (a, b) => a * b;
const add = (a, b) => a + b;

const OPERATION_CREATORS = {
  '+': makeModularAdditior,
  '*': makeModularMultiplier,
}

function makeModularAdditior(divisor) {
  return (a, b) => (a + b) % divisor;
}

function makeModularMultiplier(divisor) {
  return (a, b) => ((a % divisor) * (b % divisor)) % divisor;
}

function parseOperation(rawOperation, divisible) {
  const [label, rawRhs] = rawOperation.split(' = ')

  const [first, operator, second] = rawRhs.trim().split(' ');

  const baseOperation = OPERATION_CREATORS[operator](divisible);

  const operation = (old) => {
    const parseArg = (arg) => arg === 'old' ? old : parseInt(arg, 10);
    return baseOperation(parseArg(first), parseArg(second));
  }

  return operation;
}

function parseFinalInteger(rawText) {
  const words = rawText.trim().split(' ');

  const finalWord = words[words.length - 1];

  const number = parseInt(finalWord, 10);

  return number;
}

function parseTest(divisible) {
  const test = (x) => x % divisible === 0;

  return test;
}


function parseMonkey(rawMonkey) {
  const lines = rawMonkey.split('\n');

  const [
    rawName,
    rawStartingItems,
    rawOperation,
    rawTest,
    rawPositive,
    rawNegative
  ] = lines;

  const name = parseName(rawName);
  const items = parseStartingItems(rawStartingItems);


  const divisible = parseFinalInteger(rawTest);

  const operation = parseOperation(rawOperation, divisible);

  const test = parseTest(divisible);

  const positive = parseFinalInteger(rawPositive);
  const negative = parseFinalInteger(rawNegative);


  return {
    name, items, operation, test, positive, negative,
  }
}

class MonkeyHandler {
  constructor(monkeys) {
    this.monkeys = monkeys;
    this.inspectionCounts = this.monkeys.map(m => 0);

    this.GAME_LENGTH = 10000;
  }

  performGame() {
    for (let i = 0; i < this.GAME_LENGTH; i++) {
      this.performRound();
    }
  }

  performRound() {
    for (const monkey of this.monkeys) {
      while (monkey.items.length > 0) {
        const item = monkey.items.shift();

        this.inspectionCounts[monkey.name] += 1;

        const next = Math.floor(monkey.operation(item) / 3)

        const target = monkey.test(next) ? monkey.positive : monkey.negative;

        const targetMonkey = this.monkeys[target];

        targetMonkey.items.push(next);
      }
    }
  }


  monkeyBusiness() {
    const countCopy = [...this.inspectionCounts];

    countCopy.sort((a, b) => b - a);

    console.log(countCopy);

    const [first, second] = countCopy;

    return first * second;
  }
}

function main(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const monkeys = input.split('\n\n').map(parseMonkey);


  const handler = new MonkeyHandler(monkeys);

  handler.performGame();

  return handler.monkeyBusiness();
}

function test() {
  console.log(main('./input.txt'));
}

function example() {
  console.log(main('./example.txt'));
}

function example2() {
  console.log(main('./example2.txt'));
}

function example3() {
  console.log(main('./example3.txt'));
}

function example4() {
  console.log(main('./example4.txt'));
}

function example5() {
  console.log(main('./example5.txt'));
}

//test();
example();
//example2();
