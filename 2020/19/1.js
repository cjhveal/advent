const fs = require('fs');


const DEBUG=false;


const ruleRegex = /^(\d+): (.+)$/
function parseRule(ruleText) {
  const ruleMatch = ruleText.match(ruleRegex);

  if (!ruleMatch) {
    throw new Error('rule not good match');
  }

  const [fullRuleMatch, ruleId, ruleBody] = ruleMatch;

  if (ruleBody[0] === '"') {
    return {id: ruleId, type: 'literal', value: ruleBody[1] };
  }

  const rules = ruleBody.split('|').map(x => {
    return {id: ruleId, type: 'sequence', value: x.trim().split(' ')}
  });

  if (rules.length === 1) {
    return rules[0];
  } else {
    return {
      id: ruleId,
      type: 'option',
      value: rules,
    }
  }
}

function strConcat(first, second) {
  return `${first}${second}`;
}

function expandRule(rule, rules) {
  if (rule.type === 'literal') {
    return rule;
  } else if (rule.type === 'sequence') {
    const expandedValue = rule.value.map(r => expandRule(rules[r], rules));
    return {
      ...rule,
      value: expandedValue,
    };
  } else if (rule.type === 'option') {
    return {
      ...rule,
      value: rule.value.map(r => expandRule(r, rules))
    }
  }
}

function prefixSetWithLiteral(set, prefix) {
  const nextSet = new Set();

  for (const item of set) {
    nextSet.add(strConcat(prefix, item));
  }

  return nextSet;
}

function suffixSetWithLiteral(set, suffix) {
  const nextSet = new Set();

  for (const item of set) {
    nextSet.add(strConcat(item, suffix));
  }

  return nextSet;
}

function concatSets(firstSet, secondSet) {
  const nextSet = new Set();

  for (const first of firstSet) {
    for (const second of secondSet) {
      nextSet.add(strConcat(first, second));
    }
  }

  return nextSet;
}

function combineSets(firstSet, secondSet) {
  const nextSet = new Set([...firstSet, ...secondSet]);

  return nextSet;
}

function evaluateRule(rule) {
  if (rule.type === 'literal') {
    return rule.value;
  } else if (rule.type === 'sequence') {
    if (rule.value.length === 1) {
      return evaluateRule(rule.value[0]);
    }

    const [firstRule, secondRule] = rule.value;

    const first = evaluateRule(firstRule);
    const second = evaluateRule(secondRule);

    if (typeof first === 'string' && typeof second === 'string') {
      return `${first}${second}`;
    } else if (typeof first === 'string' && second instanceof Set) {
      return prefixSetWithLiteral(second, first);
    } else if (first instanceof Set && typeof second === 'string') {
      return suffixSetWithLiteral(first, second);
    } else if (first instanceof Set && second instanceof Set) {
      return concatSets(first, second);
    }
  } else if (rule.type === 'option') {
    const [firstRule, secondRule] = rule.value;

    const first = new Set(evaluateRule(firstRule));
    const second = new Set(evaluateRule(secondRule));

    console.log('EVAL OPT');
    console.log('first', firstRule, first);
    console.log('second', secondRule, second);
    console.log('combined', combined)

    const combined = combineSets(first, second);

    
    return combined
  }
}



function generateSetFromRule(ruleId, rules) {
  const rule = rules[ruleId];


  const expandedRule = expandRule(rule, rules);


  const value = evaluateRule(expandedRule);


  return value;
}

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const sections = input.split('\n\n');

  const [rulesText, messagesText] = sections;

  const rules = rulesText.split('\n').map(parseRule);
  const messages = messagesText.split('\n').map(x => x.trim());


  const ruleMap = {};
  for (const rule of rules) {
    ruleMap[rule.id] = rule;
  }

  const baseRule = ruleMap['0'];





  const validMessagesSet = generateSetFromRule('0', ruleMap);

  let validCount = 0;
  for (const message of messages) {
    const isValid = validMessagesSet.has(message);
    
    if (isValid) {
      validCount += 1;
    }
  }


  return validCount;
}


function test() {
  console.log(main());
}

test();
