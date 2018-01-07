import fs from 'fs';

const data = fs.readFileSync('./data');
const lines = data.toString().trim().split('\n');

function parseLine(input) {
  const [name, propertiesString] = input.split(': ');
  const properties = propertiesString.split(', ');

  return properties.reduce(function(acc, item) {
    const [prop, value] = item.split(' ');
    acc[prop] = +value;
    return acc;
  }, {name})
}

const totalTsp = 100;
const props = ['capacity', 'durability', 'flavor', 'texture']
const ingredientProperties = [];
let bestScore = Number.NEGATIVE_INFINITY;

function enumerate(stack = []) {
  if (stack.length === props.length) {
    if (validStack(stack, ingredientProperties)) {
      bestScore =  Math.max(bestScore, calculateScore(stack, ingredientProperties));
    }
    return
  }

  for (let i = 0; i <= totalTsp; i++) {
    stack.push(i);
    enumerate(stack);
    stack.pop();
  }
}

function sum(stack) {
  return stack.reduce((acc, item) => acc + item, 0);
}

function product(stack) {
  return stack.reduce((acc, item) => acc * item, 1);
}

function max(values) {
  return values.reduce((acc, item) => {
    return (item > acc ? item : acc);
  }, Number.NEGATIVE_INFINITY);
}

function validStack(stack, ingredients) {
  if (sum(stack) !== totalTsp) {
    return false
  }

  return sum(valueForStack('calories', stack, ingredients)) === 500
}

function valueForStack(prop, stack, ingredients) {
  return stack.map((n, i) => {
    return n*ingredients[i][prop];
  });
}

function calculateScore(stack, ingredients) {
  const propScores = props.map((prop) => {
    const valueByIngredient = valueForStack(prop, stack, ingredients)

    const value = sum(valueByIngredient);

    return Math.max(0, value);
  });

  const score = product(propScores);
  return score;
}

function findBestRecipe() {
  lines.forEach(line => {
    ingredientProperties.push(parseLine(line))
  })

  enumerate();

  return bestScore;
}

function testCalculate(stack, testIngredients) {
  console.log(calculateScore(stack, testIngredients));
}


console.log(findBestRecipe())

