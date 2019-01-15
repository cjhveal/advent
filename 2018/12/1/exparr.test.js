const ExpandableArray = require('./exparr');

function assert(cond, msg) {
  console.log('testing: ', msg);
  if (!cond) {
    throw new Error(`expected the following: ${msg}`);
  }
}

function test() {
  const a = new ExpandableArray([1, 2, 3], '.');

  assert(a.size() === 3, 'should start with 3');

  assert(a.get(0) === 1, 'zero elem is 1');

  assert(a.get(-100) === '.', 'default value on get out of bound');

  a.set(0, '!');
  assert(a.get(0) === '!', 'should set 0th value');

  assert(a.size() === 3, 'should still be size 3');

  a.set(-1, '.');
  assert(a.size() === 3, 'should not grow if setting default')

  a.set(-1, '#');
  assert(a.get(-1) === '#', 'should get value we just set');
  assert(a.size() === 4, 'should expand');

  a.set(-1, '.');
  assert(a.get(-1) === '.', 'should be able to reset to default');
  assert(a.size() === 4, 'should not need to expand');


  a.set(3, 9);

  assert(a.get(3) === 9, 'should set from other end');
  assert(a.size() === 5, 'should expand from other end')

}


test();
