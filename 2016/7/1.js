const fs = require('fs');


const DEBUG=false;


function runTestCases(fn, testCases) {
    for (const [input, expected] of testCases) {
      const actual = fn(input);
      console.log(input, expected, actual);
    }
}


function hasABBA(text) {
  if (text.length < 4) {
    return false;
  }

  for (let i = 0; i < text.length - 3; i++) {
    if (text[i] !== text[i+1] && text[i] === text[i+3] && text[i+1] === text[i+2]) {
      return true;
    }
  }

  return false;
}

function testHasABBA() {
  const tests = [
    ['abba', true],
    ['aaaa', false],
    ['bddb', true],
    ['ioxxoj', true],
  ];

  for (const testCase of tests) {
    const [input, expected] = testCase;
    const actual = hasABBA(input);
    console.log(input, expected, actual);

  }
}
//testHasABBA();


function supportsABBA(address) {
  const {networks, hypernets} = address;

  return hasABBA(networks) && !hasABBA(hypernets);
}

function testSupportsABBA() {
  runTestCases(supportsABBA, [
    [parseIP('abba[mnop]qrst'), true],
    [parseIP('abcd[bddb]xyyx'), false],
    [parseIP('aaaa[qwer]tyui'), false],
    [parseIP('ioxxoj[asdfgh]zxcvbn'), true],
  ]);
}
//testSupportsABBA()


function parseIP(ipText) {
  let networks = '';
  let hypernets = '';

  let currentSeq = '';
  let inHyperNet = false;

  for (let i = 0; i < ipText.length; i++) {
    const char = ipText[i];
    if (char === '[') {
      networks += (',');
      inHyperNet = true;
    } else if (char === ']') {
      hypernets += (',');
      inHyperNet = false;
    } else {
      if (inHyperNet) {
        hypernets += char;
      } else {
        networks += char;
      }
    }
  }

  return { networks, hypernets };
}

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const addresses = input.split('\n').map(parseIP);

  const supportedIps = addresses.filter(addr => supportsABBA(addr));

  return supportedIps.length;
}

function test() {
  console.log(main());
}

test();
