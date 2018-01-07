import fs from 'fs';
const data = fs.readFileSync('./data');
const lines = data.toString().split('\n');


const places = [];
const placeMap = new Map()
const paths = [];

function makeNewPlace(start) {
  const newMap = new Map();
  placeMap.set(start, newMap);
  places.push(start);


  return newMap;
}

function addRoute(start, end, distance) {
  const localMap = placeMap.get(start) || makeNewPlace(start);

  localMap.set(end, distance);
}


var routeRegex = /(\w+) to (\w+) = (\d+)/;
function parseRoute(input) {
  const match = input.match(routeRegex);

  if (!match) {
    return console.log('sad panda', input)
  }
  const [full, start, end, distance] = match;

  addRoute(start, end, +distance);
  addRoute(end, start, +distance);
}

function visited(stack, place) {
  return stack.indexOf(place) !== -1
}

function neighbors(start, end) {
  const localMap = placeMap.get(start)
  return localMap && localMap.has(end);
}


function calculatePathDistance(stack) {
  let prevValue = stack[0];
  return stack.slice(1).reduce(function(acc, value) {

    acc += placeMap.get(prevValue).get(value);
    prevValue = value;

    return acc;
  }, 0);
}

function findRoutes(stack) {
  if (stack.length === places.length) {
    paths.push(calculatePathDistance(stack));
    return;
  }

  const lastVisited = stack[stack.length-1]
  for (let place of places) {
    if (visited(stack, place) || !neighbors(lastVisited, place)) {
      continue;
    }

    stack.push(place);
    findRoutes(stack);
    stack.pop(place);
  }
}

lines.forEach(parseRoute);
console.log(places);


console.log(visited(['a', 'b', 'c'], 'c'))
console.log(visited(['a', 'b', 'c'], 'd'))
console.log(placeMap.get('Tambi').get('Norrath'));

for(let place of places) {
  findRoutes([place])
}

console.log(Math.max.apply(null, paths))

