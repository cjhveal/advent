const fs = require('fs');
const crypto = require('crypto')

const DEBUG=false;

function md5Hash(text) {
  return crypto.createHash('md5').update(text).digest('hex');
}


function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  let result = Array(8).fill('');

  let solved = 0;
  let count = 0;
  while (solved < 8) {
    const candidate = `${input}${count}`;
    const hash = md5Hash(candidate)

    if (hash.slice(0, 5) === '00000') {
      let position = hash[5];
      if ('0' <= position && position <= '7') {
        const index = Number(position);
        if (!result[index]) {
          result[index] = hash[6];
          solved += 1;
        }
      }
    }

    count += 1;
  }

  return result.join('');
}

function test() {
  console.log(main());
}

test();
