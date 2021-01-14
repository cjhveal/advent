const fs = require('fs');


const DEBUG=false;

const OPERATORS = ['+', '-', '*', '/', '(', ')'];
function charIsOperator(char) {
  return OPERATORS.includes(char);
}

const DIGIT_REGEX = /^\d$/;
function charIsDigit(value) {
  return DIGIT_REGEX.test(value);
}

function tokenizeExpression(expressionText) {
  const tokens = [];

  let currentToken = '';
  for (let i = 0; i < expressionText.length; i++) {
    const char = expressionText[i];

    const isDigit = charIsDigit(char);
    const isOperator = charIsOperator(char);
    const isWhitespace = char === ' ';


    if ((isOperator || isWhitespace) && currentToken.length) {
      tokens.push(currentToken);
      currentToken = '';
    }

    if (isOperator) {
      tokens.push(char);
    }

    if (isDigit) {
      currentToken += char;
    }
  }

  if (currentToken.length) {
    tokens.push(currentToken);
    currentToken = '';
  }

  return tokens;
}

const last = (array) => array[array.length - 1];

function parseExpression(text) {
  const tokens = tokenizeExpression(text);
  const expressionStack = [[]];

  for (const token of tokens) {
    if (token === '(') {
      expressionStack.push([]);
    } else if (token === ')') {
      const subExpression = expressionStack.pop();
      last(expressionStack).push(subExpression);
    } else {
      last(expressionStack).push(token);
    }
  }

  return last(expressionStack);
}

class ExpressionMachine {

  static eval(expression) {
    const machine = new ExpressionMachine();

    for (const token of expression) {
      machine.consume(token);
    }

    return machine.value();
  }

  constructor() {
    this.first = null;
    this.second = null;
    this.operator = null;
    this.state = 'INIT';

    this.operations = {
      '+': (a, b) => a + b,
      '-': (a, b) => a - b,
      '*': (a, b) => a * b,
    }
  }

  consume(value) {
    if (!this.first) {
      this.first = value;
    } else if (!this.operator) {
      if (charIsOperator(value)) {
        this.operator = value;
      } else {
        throw new Error(`expecting operator, got ${value}`);
      }
    } else if (!this.second) {
      this.second = value;

      this.evaluate();
    }
  }

  evaluate() {
    const operation = this.getOperation();

    if (Array.isArray(this.first)) {
      this.first = ExpressionMachine.eval(this.first);
    }

    if (Array.isArray(this.second)) {
      this.second = ExpressionMachine.eval(this.second);
    }

    this.first = operation(Number(this.first), Number(this.second));
    this.operator = null;
    this.second = null;
  }

  getOperation(operator = this.operator) {
    return this.operations[operator];
  }

  value() {
    return this.first;
  }
}

function sum(array) {
  let total = 0;

  for (const value of array) {
    total += value;
  }

  return total;
}

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const expressions = input.split('\n').map(parseExpression);

  const expressionValues = expressions.map(expr => ExpressionMachine.eval(expr));

  return sum(expressionValues);

}


function test() {
  console.log(main());
}

test();
