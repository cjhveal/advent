const fs = require('fs');



const whitespaceRegexp = /\s+/g;

const requiredFields = () => new Set(['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']);

const parsePassport = (text) => {
  const fields = text.split(whitespaceRegexp);
}

const validatePassport = (passport) => {
  const required = requiredFields();
  for (const field of passport) {
    const [label, value] = field.split(':');
    required.delete(label);
  }

  return (required.size === 0);
}

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');
  const passports = input.split('\n\n').map(x => x.split(whitespaceRegexp));

  let total = 0;
  for (const p of passports) {
    if (validatePassport(p)) {
      total += 1;
    }
  }

  return total;
}

function test() {
  console.log(main());
}

test();
