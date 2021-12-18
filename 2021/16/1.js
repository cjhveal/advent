const fs = require('fs');

const DEBUG = true;

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


function sumVersions(packet) {
  const versionBin = parseInt(packet.version, 2);

  if (packet.subPackets) {
    let total = versionBin;
    for (const p of packet.subPackets) {
      total += sumVersions(p);
    }

    return total;
  }

  return versionBin;
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

  return sumVersions(packet);
}

function run(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8');
  console.log(main(input));
}

function test() {
  run('input.txt');
}

function exampleLiteral() {
  console.log(main('D2FE28'));
}

function exampleOperator0() {
  console.log(main('38006F45291200'));
}

function exampleOperator1() {
  console.log(main('EE00D40C823060'));
}

function example1() {
  // sums to 16
  console.log(main('8A004A801A8002F478'));
}

function example2() {
  // sums to 12
  console.log(main('620080001611562C8802118E34'));
}

function example3() {
  // sums to 23
  console.log(main('C0015000016115A2E0802F182340'));
}

function example4() {
  // sums to 31
  console.log(main('A0016C880162017C3686B18A3D4780'));
}


//exampleOperator1();
//example4();
test();
