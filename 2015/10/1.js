function runLengthEncode(input) {
  let output = ''
  let n = 0;

  for (let i in input) {
    n += 1;
    const ch = input.charAt(i)
    const next = input.charAt(+i+1);

    if (ch === next) {
      continue;
    }

    output += n;
    output += ch;
    n = 0;
  }

  return output;
}

const initialValue = '1113222113';
function applyN(n, fn, init) {
  let arg = init;
  for (let i = 1; i <= n; i++) {
    arg = fn(arg);
  }
  return arg;
}

const output = applyN(50, runLengthEncode, initialValue)
console.log(output.length)


