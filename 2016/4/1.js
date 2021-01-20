const fs = require('fs');


const DEBUG=false;


function count(array) {
  const result = {};
  for (const item of array) {
    result[item] = (result[item] || 0) + 1;
  }
  return result;
}

function sum(array) {
  let total = 0;
  for (const item of array) {
    total += Number(item);
  }
  return total;
}

function roomChecksum(room) {
  const chars = room.encryptedName.split('').filter(x => x !== '-');

  const charCount = count(chars);


  const countEntries = Object.entries(charCount);

  countEntries.sort(([charA, countA], [charB, countB]) => {
    const delta = countB - countA;

    if (delta === 0) {
      return (charA < charB) ? -1 : (charA > charB) ? 1 : 0;
    }

    return delta;
  });

  const checksum = countEntries.slice(0, 5).map(([char]) => char).join('');

  return checksum;
}


const roomRegex = /(.+)-(\d+)\[(.+)\]/;
function parseRoom(roomText) {
  const roomMatch = roomText.match(roomRegex);

  if (!roomMatch) {
    throw new Error(`Cannot parse room: ${roomText}`);
  }

  const [fullMatch, encryptedName, sectorId, checksum] = roomMatch;

  return {encryptedName, sectorId, checksum};
}

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const rooms = input.split('\n').map(parseRoom);

  const realRooms = rooms.filter(room => roomChecksum(room) === room.checksum);

  const realSectorIds = realRooms.map(room => room.sectorId);

  return sum(realSectorIds);
}

function test() {
  console.log(main());
}

test();
