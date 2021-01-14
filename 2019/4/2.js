const fs = require('fs');


function isIncreasing(array) {
  for (let i = 0; i < array.length - 1; i++) {
    if (array[i] > array[i+1]) {
      return false;
    }
  }

  return true;
}

function hasAdjacentRepeat(array) {
  let hasRepeat = false; 
  for (let i = 0; i < array.length -1; i++) {
    if (array[i] === array[i+1]) {
      let count = 0;
      for (let j = i; j < array.length; j++) {
        if (array[j] === array[i]) {
          count += 1;
        } else {
          break;
        }
      }

      if (count === 2){
        return true;
      } else {
        i += (count-1);
      }
    }
  }

  return false;
}


function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const [minRange, maxRange] = input.split('-').map(Number);


  let total = 0;
  for (let i = minRange; i <= maxRange; i++) {
    const digits = i.toString().split('').map(Number);

    if (isIncreasing(digits) && hasAdjacentRepeat(digits)) {
      total += 1;
    }
  }


  return total;
}

function test() {
  console.log(main());
}

test();
