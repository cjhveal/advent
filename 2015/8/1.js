import fs from 'fs';

const data = fs.readFileSync('./data');
const inputs = data.toString().split('\n').map(line => line.trim());

const escapeRegex = /\\("|\\|x)/g;

// code len - memory len
const diffs = {
  "\\\\": 1, // 2 - 1
  "\\\"": 1, // 2 - 1
  "\\x": 3, // 4 - 1
}

let sum = 0;

function calcDifference(input) {
  let difference = 2; // initial & final quotes
  let match;
  do {
    match = escapeRegex.exec(input);
    if(match) {
      difference += diffs[match[0]]
    }
  } while (match);

  return input.length - difference;
}

var sampleData = [
  "\"\"", "\"abc\"", "\"aaa\\\"aaa\"", "\"\\x27\""
]


inputs.forEach(function(x) {
  sum += x.length - calcDifference(x)
});

console.log(sum);
