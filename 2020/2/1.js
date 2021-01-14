const fs = require('fs');


const policyRegexp = /(\d+)\-(\d+)\s+(\w):\s+(.+)/;
const parsePolicy = (line) => {
  const [match, min, max, char, password] = line.match(policyRegexp);
  return {
    min: Number(min),
    max: Number(max),
    char,
    password,
  };
}

const countChar = (char, str) => {
  let total = 0;
  for (const c of str.split('')) {
    if (c === char) {
      total += 1;
    }
  }

  return total;
}

const validatePolicy = (policy) => {
  const { min, max, char, password } = policy;
  const count = countChar(char, password);

  return (min <= count && count <= max);
}

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');
  const lines = input.split('\n');

  let total = 0;

  for (const line of lines) {
    const policy = parsePolicy(line);
    if (validatePolicy(policy)) {
      total += 1;
    }
  }

  return total;
}

function test() {
  console.log(main());
}

test();
