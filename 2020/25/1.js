const fs = require('fs');


const DEBUG=true;

function transform(subject, loopSize) {
  let value = 1;

  for (let i = 0; i < loopSize; i++) {
    value *= subject;
    value = value % 20201227;
  }

  return value;
}

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const publicKeys = input.split('\n').map(Number);
  const [cardKey, doorKey] = publicKeys;

  const initialSubject = 7;

  let size = 0;
  while (true) {
    size += 1;
    const candidate = transform(initialSubject, size);

    if (candidate === cardKey) {
      // candidate is card loop size
      return transform(doorKey, candidate);
    } else if (candidate === doorKey) {
      // candidate is door loop size
      return transform(cardKey, candidate);
    }

    if (DEBUG) {
      if (size % 10000 === 0) {
        console.log(size, candidate);
      }
    }
  }
}

function test() {
  console.log(main());
}

test();
