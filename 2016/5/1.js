const fs = require('fs');
const crypto = require('crypto')

const DEBUG=false;

function md5Hash(text) {
  return crypto.createHash('md5').update(text).digest('hex');
}


function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  let result = '';

  let count = 0;
  while (result.length < 8) {
    const candidate = `${input}${count}`;
    const hash = md5Hash(candidate)

    if (hash.slice(0, 5) === '00000') {
      result = result + hash[5];
    }

    count += 1;
  }

  return result;
}

function test() {
  console.log(main());
}

test();
