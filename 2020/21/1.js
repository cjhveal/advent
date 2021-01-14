const fs = require('fs');


const DEBUG=false;


const FOOD_REGEX = /^(.+) \(contains (.+)\)/;
function parseFood(foodText) {
   const foodMatch = foodText.match(FOOD_REGEX);
  if(!foodMatch) {
    throw new Error('could not parse food', foodText);
  }

  const [fullMatch, ingredientsText, allergensText] = foodMatch;

  const ingredients = ingredientsText.trim().split(' ');
  const allergens = allergensText.trim().split(', ');

  return { ingredients, allergens };
}

function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const foodsList = input.split('\n').map(parseFood);

  const allergensSet = new Set();
  const ingredientWarnings = {};

  for (const food of foodsList) {
    for (const allergen of food.allergens) {
      allergensSet.add(allergen);
      for (const ingredient of food.ingredients) {
        const ingredientSet = ingredientWarnings[ingredient] || new Set();

        ingredientSet.add(allergen);

        ingredientWarnings[ingredient] = ingredientSet;
      }
    }
  }

  //console.log(ingredientWarnings);

  for (const food of foodsList) {
    for (const allergen of food.allergens) {
      for (const ingredient of Object.keys(ingredientWarnings)) {
        const warnings = ingredientWarnings[ingredient];

        if (warnings.has(allergen) && !food.ingredients.includes(ingredient)) {
          warnings.delete(allergen);
        }
      }
    }

  }

  const safeIngredients = new Set();

  for (const ingredient of Object.keys(ingredientWarnings)) {
    const warnings = ingredientWarnings[ingredient];

    if (warnings.size === 0) {
      safeIngredients.add(ingredient);
    }
  }

  

  let total = 0;

  for (const food of foodsList) {
    for (const ingredient of food.ingredients) {
      if (safeIngredients.has(ingredient)) {
        total += 1;
      }
    }
  }


  return total;
  /*
  const possibleAllergensMap = {};
  for (const allergen of allergensSet) {
    const possibleAllergens = new Set();
    
    for (const food of foodsList) {
      if (allergens) {

      }
    }

    possibleAllergensMap[allergen] = {};
  }
  */

  
}


function test() {
  console.log(main());
}

test();
