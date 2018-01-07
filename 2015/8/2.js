import fs from 'fs';
const data = fs.readFileSync('./data');
const inputs = data.toString().split('\n').map(line => line.trim());


var sampleData = [
  "\"\"", "\"abc\"", "\"aaa\\\"aaa\"", "\"\\x27\""
]


function encode(input) {
  return '"' + input.replace(/(\\|")/g, '\\$1') + '"'
}

let sum = 0;
inputs.forEach(x => {
  sum += encode(x).length - x.length
})

console.log(sum);
