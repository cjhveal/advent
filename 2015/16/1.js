import fs from 'fs';

const data = fs.readFileSync('./data')
const lines = data.toString().trim().split('\n');

const giftAunt = {
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3,
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1
}

const sueRegex = /^Sue \d+: /;
function parseLine(input) {
  const attrsString = input.replace(sueRegex, '');
  const attrStrings = attrsString.split(', ');
  const attrs = attrStrings.reduce((acc, item) => {
    const [key, value] = item.split(': ');
    acc[key] = +value;
    return acc;
  }, {})

  return attrs;
}

function isGiftAunt(aunt) {
  return Object.keys(aunt).every(key => aunt[key] === giftAunt[key])
}

function findGiftAunt(aunts) {
  return aunts.findIndex(isGiftAunt)
}

function isGiftAuntWithBrokenMachine(aunt) {
  return Object.keys(aunt).every(key => {
    switch(key) {
      case 'cats':
      case 'trees':
      return aunt[key] > giftAunt[key];

      case 'pomeranians':
      case 'goldfish':
      return aunt[key] < giftAunt[key];

      default:
      return  aunt[key] === giftAunt[key];
    }
  })
}

function findGiftAuntWithBrokenMachine(aunts) {
  return aunts.findIndex(isGiftAuntWithBrokenMachine);
}


const aunts = lines.map(line => parseLine(line))

console.log(`Aunt that gave gift was Sue ${findGiftAunt(aunts) + 1}`);
console.log(`Oops, the machine is broken... actually it was Sue ${findGiftAuntWithBrokenMachine(aunts) + 1}`)
