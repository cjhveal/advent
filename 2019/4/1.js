const fs = require('fs');



function zip(array1, array2) {
  const result = [];
  for (let i = 0; i < array1.length; i++) {
    result.push({ min: array1[i], max: array2[i] });
  }
}

function loopDigits(ranges, fn) {
  for (let a = ranges[0].min; a < ranges[0].max; a++) {
    for (let b = ranges[1].min; b < ranges[1].max; b++) {
      for (let c = ranges[2].min; c < ranges[2].max; c++) {
        for (let d = ranges[3].min; d < ranges[3].max; d++) {
          for (let e = ranges[4].min; e < ranges[4].max; e++) {
            for (let f = ranges[5].min; f < ranges[5].max; f++) {
              const digits = [a,b,c,d,e,f];
              const number = Number(digits.join(''))

              const result = fn(number, digits);
            }
          }
        }
      }
    }
  }
}


function isIncreasing(array) {
  for (let i = 0; i < array.length - 1; i++) {
    if (array[i] > array[i+1]) {
      return false;
    }
  }

  return true;
}

function hasAdjacentRepeat(array) {
  for (let i = 0; i < array.length -1; i++) {
    if (array[i] === array[i+1]) {
      return true;
    }
  }

  return false
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
