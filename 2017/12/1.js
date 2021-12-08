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

  const programSets = programs.map(program => {
    const [id, members] = program.split(' <-> ');

    const memberIds = members.split(', ').map(Number)
    const memberSet = new Set(memberIds);

    return memberSet;
  });

  const group = new Set();

  const finalGroup = visit(group, programSets, 0);

  return finalGroup.size;

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
