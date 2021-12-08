const fs = require('fs');

function visit(group, list, seed) {
  group.add(seed);
  const candidateSet = list[seed];

  for (const elem of candidateSet) {
    if (!group.has(elem)) {
      visit(group, list, elem);
    }
  }

  return group;
}

function solve(input) {
  const programs = input.trim().split('\n');

  let programSets = programs.map(program => {
    const [id, members] = program.split(' <-> ');

    const memberIds = members.split(', ').map(Number)
    const memberSet = new Set(memberIds);

    return memberSet;
  });

  let totalGroups = 0;
  const allSeen = new Set();

  while (allSeen.size < programSets.length) {
    totalGroups += 1;

    const group = new Set();

    const firstUnseen = programSets.findIndex((elem, i) => !allSeen.has(i));

    visit(group, programSets, firstUnseen);

    for (const elem of group) {
      allSeen.add(elem);
    }
  }

  return totalGroups;

}

function main() {
  const input = fs.readFileSync('input.txt', 'utf8');

  return solve(input)
}

const TEST_INPUT = `0 <-> 2
1 <-> 1
2 <-> 0, 3, 4
3 <-> 2, 4
4 <-> 2, 3, 6
5 <-> 6
6 <-> 4, 5`;

//console.log(solve(TEST_INPUT))

console.log(main())
