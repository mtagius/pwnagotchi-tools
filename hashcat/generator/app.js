const fs = require('fs');
const config = require('./config');

function generateCombinations(words) {
  const combinations = [];

  // Generate combinations
  for (let i = 0; i < words.length; i++) {
    for (let j = i + 1; j < words.length; j++) {
      const combined = words[i] + words[j];
      combinations.push(combined);

      // Add reversed combination as well
      const reversedCombined = words[j] + words[i];
      combinations.push(reversedCombined);
    }
  }

  return combinations;
}

// Example usage with the provided list
const initialWords = config.wordList;
const result = generateCombinations(initialWords);

// Print specified number of items in the terminal
const itemsToPrint = Math.min(config.printItems, result.length);
console.log(`Printing ${itemsToPrint} items:`);
console.log(result.slice(0, itemsToPrint));

// Write the specified number of permutations to a file
const permutationsToGenerate = config.generatePermutations;
const outputFile = config.exportFileName;

fs.writeFileSync(outputFile, result.slice(0, permutationsToGenerate).join('\n'));
console.log(`Combinations written to ${outputFile}`);
