function runTests(fn, testCases) {
  for (const [input, expected] of testCases) {
    const actual = fn(input);
    console.log(input, expected, actual);
  }
}


module.exports = {
  runTests,
}
