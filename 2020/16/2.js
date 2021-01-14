const fs = require('fs');


const DEBUG=false;



const ruleRegex = /(.+):\s+(\d+)\-(\d+) or (\d+)\-(\d+)/;
function parseRule(ruleText) {
  const ruleMatch = ruleText.match(ruleRegex);
  if (!ruleMatch) {
    throw new Error('invalid rule parse', ruleText);
  }

  const [fullMatch, label, firstLower, firstUpper, secondLower, secondUpper] = ruleMatch;


  return {
    label,
    firstLower, firstUpper,
    secondLower, secondUpper
  }
}

function parseTicketBlock(ticketBlock) {
  const [header, ...ticketsText] = ticketBlock.split('\n');

  const tickets = ticketsText.map(ticketText => {
    return ticketText.split(',').map(Number);
  });

  return tickets;
}

function isRuleValid(number, rule) {
  const {firstLower, firstUpper, secondLower, secondUpper} =  rule;


    return (
      (firstLower <=  number && number <= firstUpper)
      || (secondLower <= number && number <= secondUpper)
    );
}

function isFieldValid(number, rules) {
  for (const rule of rules) {
    if (isRuleValid(number, rule)) {
        return true;
    }
  }

  return false
}

function getInvalidFields(ticket, rules) {
  const results = [];

  for (const field of ticket) {
    if (!isFieldValid(field, rules)) {
      results.push(field);
    }
  }

  return results;
}


function sum(array) {
  let total = 0;

  for (const item of array) {
    total += item;
  }

  return total;
}

function product(array) {
  let total = 1;

  for (const item of array) {
    total *= item;
  }

  return total;
}

function clearFromSets(value, setList) {
}


function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const sections = input.split('\n\n');
  const [rulesText, myTicketText, otherTicketsText] = sections;


  const rules = rulesText.split('\n').map(parseRule);

  const myTicket = parseTicketBlock(myTicketText)[0];

  const otherTickets = parseTicketBlock(otherTicketsText);


  const validTickets = otherTickets.filter((ticket) => {

    const invalidFields = getInvalidFields(ticket, rules);

    return invalidFields.length === 0;
  });

  const ticketLength = myTicket.length;
  const fieldLabels = rules.map(rule => rule.label);


  const fieldSets = [];
  for (let i = 0; i < ticketLength; i++) {
    const fieldSet = new Set(fieldLabels);
      
    for (const ticket of validTickets) {
      const value = ticket[i];

      for (const rule of rules) {
        if (!isRuleValid(value, rule)) {
          fieldSet.delete(rule.label);
        }
      }
    }

    fieldSets.push({ index: i, fieldSet });
  }

  fieldSets.sort((a, b) => a.fieldSet.size - b.fieldSet.size);

  const labelToIndex = {};

  for (const item of fieldSets) {
    const { index, fieldSet } = item;

    if (fieldSet.size === 1) {
      const [value] = [...fieldSet];

      labelToIndex[value] = index;

      fieldSets.forEach(x => x.fieldSet.delete(value));
    } else {
      console.log('uh oh');
    }
  }


  const solutionItems = ['departure location', 'departure station', 'departure platform', 'departure track', 'departure date', 'departure time'];

  const solutionIndices = solutionItems.map(key => labelToIndex[key]);

  const ticketSolution = solutionIndices.map(index => myTicket[index]);

  const solution = product(ticketSolution);


  return solution;

}


function test() {
  console.log(main());
}

test();
