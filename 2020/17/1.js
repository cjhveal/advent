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

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const sections = input.split('\n\n');
  const [rulesText, myTicketText, otherTicketsText] = sections;


  const rules = rulesText.split('\n').map(parseRule);

  const myTicket = parseTicketBlock(myTicketText)[0];

  const otherTickets = parseTicketBlock(otherTicketsText);




  const invalidTickets = otherTickets.map(ticket => getInvalidFields(ticket, rules));
  
  const invalidFields = [].concat(...invalidTickets).filter(Boolean);;

  
  return sum(invalidFields);

}


function test() {
  console.log(main());
}

test();
