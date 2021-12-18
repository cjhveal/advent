const fs = require('fs');

const DEBUG = false;

function hexToBinString(hex) {
  return hex.split('').map(hexDigit =>
    parseInt(hexDigit, 16).toString(2).padStart(4, '0')
  ).join('');
}

function parseLiteral(bitString, state = {index: 0}) {
  let value = '';

  while (state.index < bitString.length) {
    const {index} = state;
    const group = bitString.slice(index, index + 5);
    state.index += 5;
    value += group.slice(1, 5);
    if (group[0] === '0') {
      break;
    }
  }

  return value;
}

function parsePacket(bitString, state = {index: 0}) {
  const version = bitString.slice(state.index, state.index + 3);
  const type = bitString.slice(state.index + 3, state.index + 6);

  state.index += 6;

  if (type === '100') {
    const value = parseLiteral(bitString, state);
    const bin = parseInt(value, 2);

    return {version, type, value, bin};
  }


  const lengthType = bitString[state.index];
  state.index += 1;

  const subPackets = [];
  if (lengthType === '0') {
    const lengthBits = bitString.slice(state.index, state.index + 15);
    state.index += 15;

    const subPacketLength = parseInt(lengthBits, 2);

    const startIndex = state.index;
    while (state.index < startIndex + subPacketLength) {
      subPackets.push(parsePacket(bitString, state));
    }
  } else {
    const lengthBits = bitString.slice(state.index, state.index + 11);
    state.index += 11;

    const subPacketCount = parseInt(lengthBits, 2);

    for (let i = 0; i < subPacketCount; i++) {
      subPackets.push(parsePacket(bitString, state));
    }
  }

  return {version, type, subPackets};
}


const OPERATORS = {
  // sum
  '000': (values) => {
    return values.reduce((acc, item) => acc + item, 0);
  },

  // product
  '001': (values) => {
    return values.reduce((acc, item) => acc * item, 1);
  },

  // minimum
  '010': (values) => {
    let min = Infinity;
    for (const value of values) {
      if (value < min) {
        min = value;
      }
    }

    return min;
  },

  // maximum
  '011': (values) => {
    let max = -Infinity;
    for (const value of values) {
      if (max < value) {
        max = value;
      }
    }

    return max;
  },

  // literal
  '100': (packet) => {},

  // greater than
  '101': (values) => {
    const [a, b] = values;

    return a > b ? 1 : 0;
  },
  // less than
  '110': (values) => {
    const [a, b] = values;

    return a < b ? 1 : 0;
  },
  // equal to
  '111': (values) => {
    const [a, b] = values;

    return a === b ? 1 : 0;
  },
}

function evaluatePacket(packet) {
  if (packet.type === '100') {
    return packet.bin;
  }

  const values = packet.subPackets.map(p => evaluatePacket(p));

  const operator = OPERATORS[packet.type];

  return operator(values);
}

function main(input) {
  const bitString = hexToBinString(input);

  if (DEBUG) {
    console.log(input, bitString);
  }

  const packet = parsePacket(bitString);

  if (DEBUG) {
    console.log(packet);
  }

  return evaluatePacket(packet);
}

function run(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');
  console.log(main(input));
}

function test() {
  run('input.txt');
}


function example1() {
  // sums to 3
  console.log(main('C200B40A82'));
}

function example2() {
  // multiplies to 54
  console.log(main('04005AC33890'));
}

function example3() {
  // reduces minimum 7
  console.log(main('880086C3E88112'));
}

function example4() {
  // reduces maxmium 9
  console.log(main('CE00C43D881120'));
}

function example5() {
  // returns 1 because 5 < 15
  console.log(main('D8005AC2A8F0'));
}

function example6() {
  // returns 0, because 5 is not greater than 15
  console.log(main('F600BC2D8F'));
}

function example7() {
  // returns 0, because 5 is not equal to 15
  console.log(main('9C005AC2F8F0'));
}

function example8() {
  // returns 1, because 1 + 3 = 2 * 2
  console.log(main('9C0141080250320F1802104A08'));
}

//example8();
test();
