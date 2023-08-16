const fs = require('fs');

const DISK_SIZE = 272;

const DEBUG = false;

function expand(a) {
  let result = a + '0';

  for (let i = a.length - 1; i >= 0; i--) {
    result += a[i] === '0' ? '1' : '0';
  }

  return result
}

function compress(input) {
  let result = '';
  for (let i = 0; i < input.length; i += 2) {
    const a = input[i];
    const b = input[i+1];

    result += a === b ? '1' : '0';
  }

  return result;

}

function checksum(input) {
  let data = input;

  while (data.length % 2 === 0) {
    data = compress(data);
  }

  return data;
}


function main(input) {
  let data = input;

  while (data.length < DISK_SIZE) {
    data = expand(data);
    if (DEBUG) {
      console.log(data);
    }
  }

  const truncated = data.slice(0, DISK_SIZE);

  return checksum(truncated);
}

function run(input) {
  console.log(main(input));
}

function runFromFile(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');

  run(input);
}

function test() {
  run(`10011111011011001`);
}

function example1() {
}

function example2() {
  runFromFile('example2.txt');
}

function example3() {
  runFromFile('example3.txt');
}

function example4() {
  runFromFile('example4.txt');
}

function example5() {
  runFromFile('example5.txt');
}

//example1();
test();
