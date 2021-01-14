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


  let dangerousIngredients = [];
  for (const ingredient of Object.keys(ingredientWarnings)) {
    const warnings = ingredientWarnings[ingredient];

    if (warnings.size > 0) {
      dangerousIngredients.push({ingredient, warnings});
    }
  }





  const finalList = [];

  while (dangerousIngredients.length) {
    dangerousIngredients.sort((a, b) => a.warnings.size - b.warnings.size);

    const {ingredient, warnings} = dangerousIngredients[0];
    if (warnings.size === 1) {
      const allergen = Array.from(warnings)[0];

      finalList.push({ingredient, allergen});

      for (const d of dangerousIngredients) {
        d.warnings.delete(allergen);
      }
    }

    dangerousIngredients = dangerousIngredients.filter(x => x.warnings.size > 0);
  }

  console.log(finalList);

  finalList.sort((a, b) => {
    if(a.allergen < b.allergen) { return -1; }
    if(a.allergen > b.allergen) { return 1; }
    return 0;
  });



  const result = finalList.map(x => x.ingredient).join(',');


  return result;
  
}


function test() {
  console.log(main());
}

test();
