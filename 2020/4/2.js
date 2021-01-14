const fs = require('fs');

const DEBUG = false;


const whitespaceRegexp = /\s+/g;

const requiredFields = () => new Set(['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']);


const validations = {
  byr: (x) => x.length === 4 && 1920 <= Number(x) && Number(x) <= 2002,
  iyr: (x) => x.length === 4 && 2010 <= Number(x) && Number(x) <= 2020,
  eyr: (x) => x.length === 4 && 2020 <= Number(x) && Number(x) <= 2030,
  hgt: (x) => {
    const regexp = /(\d+)(cm|in)/;
    const match = x.match(regexp);
    if (!match) {
      return false;
    }
    const [isMatch, n, unit] = match;
    const num = Number(n);
    if (unit === 'cm') {
      return (150 <= num && num <= 193);
    } else if ( unit === 'in') {
      return (59 <= num && num <= 76);
    } else {
      return false
    }
  },
  hcl: (x) => {
    const regexp = /#[0-9a-f]{6}/;
    return regexp.test(x);
  },
  ecl: (x) => {
    const validEcl = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];
    return validEcl.includes(x);
  },
  pid: (x) => {
    const regexp = /^(0*)([1-9][0-9]*)$/;
    const match = x.match(regexp)
    if (!match) {
      return false;
    }

   // console.log(x, match);
    const [isMatch, leadingZeros, passportNumber] = match;

    const passportIdLength = (leadingZeros.length + passportNumber.length);

    return passportIdLength === 9;
  },
}

const validatePassport = (passport) => {
  const required = requiredFields();
  for (const field of passport) {
    const [label, value] = field.split(':');

    const validation = validations[label];
    if (validation) {
      const isValid = validation(value);
      if (DEBUG) {
        console.log(label, value, isValid);
      }
      if (!isValid) {
        return false;
      }
    }

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
