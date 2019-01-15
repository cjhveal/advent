const input = `14	0	15	12	11	11	3	5	1	6	8	4	9	1	8	4`;

function parseBanks(banksText) {
  return banksText.split(/\s+/g).map(x => parseInt(x, 10));
}

function indexOfMax(banks) {
  let idx = 0;
  let max = banks[idx];
  for (let i = 0; i < banks.length; i++) {
    const value = banks[i];
    if (value > max) {
      max = value;
      idx = i;
    }
  }

  return idx;
}

const inputBanks = parseBanks(input);

console.log(redistribute(inputBanks, indexOfMax(inputBanks)));
console.log(redistribute(inputBanks, indexOfMax(inputBanks)));
console.log(redistribute(inputBanks, indexOfMax(inputBanks)));
console.log(redistribute(inputBanks, indexOfMax(inputBanks)));
console.log(redistribute(inputBanks, indexOfMax(inputBanks)));

function encodeBanks(banks) {
  return banks.join(',');
}

function seenBefore(set, banks) {
  return set.has(encodeBanks(banks));
}

function redistribute(banks, start) {
  let i = start;
  let n = banks[start];
  banks[start] = 0;

  while (n > 0) {
    i = (i + 1) % banks.length;
    banks[i] += 1;
    n -= 1;
  }

  return banks;
}

function runBanks(inputBanks) {
  const seenSet = new Set();

  let n = 0;
  let banks = inputBanks;
  let encoded = encodeBanks(banks);
  while (true) {
    n += 1;
    const index = indexOfMax(banks);
    banks = redistribute(banks, index);
    encoded = encodeBanks(banks);

    if (seenSet.has(encoded)) {
      break;
    } else {
      seenSet.add(encoded);
    }
  }

  return n;
}

function test(banks) {
  console.log(runBanks(parseBanks(banks)));
}

test(input);
