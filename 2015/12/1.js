import fs from 'fs';
const data = JSON.parse(fs.readFileSync('data'))

function sumValue(value) {
  if (typeof value === 'number') {
    return value;
  } else if (typeof value === 'object') {
    const isArray = Array.isArray(value);
    let sum = 0;
    for (let key in value) {
      if (!isArray && value[key] === 'red') {
        return 0
      }
      sum += sumValue(value[key])
    }
    return sum;
  }

  return 0;
}

function test(val) {
  console.log(sumValue(val))
}

test(data)
