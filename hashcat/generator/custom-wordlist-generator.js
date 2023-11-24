const fs = require("fs");
const config = require("../../config");

// Function to generate combinations of a given array of words
function generateCombinations(words) {
	const combinationsSet = new Set();

	// Recursive function to generate combinations
	function generate(currentCombination, remainingWords) {
		if (remainingWords === 0) {
			combinationsSet.add(currentCombination);
			return;
		}

		for (let i = 0; i < words.length; i++) {
			// Avoid combining the same word with itself or repeating within the combination
			if (currentCombination !== words[i] && !currentCombination.includes(words[i])) {
				generate(currentCombination + words[i], remainingWords - 1);
			}
		}
	}

	for (let k = 1; k <= config.MAX_WORDS_USED; k++) {
		for (let i = 0; i < words.length; i++) {
			generate(words[i], k - 1);
		}
	}

	return Array.from(combinationsSet);
}

// Example usage with the provided list
const initialWords = config.WORD_LIST;
const result = generateCombinations(initialWords);

// Custom sorting function based on config variables
const customSort = (a, b) => {
	if (config.SORT_BY_LENGTH) {
		if (a.length !== b.length) {
			return config.SORT_LENGTH_ASCENDING ? a.length - b.length : b.length - a.length;
		}
	}

	return config.SORT_ALPHABETICALLY ? a.localeCompare(b) : 0;
};

// Sort combinations using the custom sorting function
const sortedResult = result.sort(customSort);

// Filter combinations based on config variables for min/max length
const filteredResult = sortedResult.filter((combo) => {
	const length = combo.length;
	return (!config.MIN_LENGTH || length >= config.MIN_LENGTH) && (!config.MAX_LENGTH || length <= config.MAX_LENGTH);
});

// Print count of unique combinations generated in the terminal
console.log(`Generated ${filteredResult.length} unique combinations.`);

// Print specified number of items in the terminal
const itemsToPrint = Math.min(config.PRINT_ITEMS, filteredResult.length);
console.log(`Printing ${itemsToPrint} items:`);
console.log(filteredResult.slice(0, itemsToPrint));

// Write the specified number of combinations to a file
const combinationsToGenerate = config.GENERATE_COMBINATIONS;
const outputFile = config.EXPORT_FILE_NAME;

// Sort combinations alphabetically before writing to the file
const sortedCombinations = filteredResult.sort(customSort);
fs.writeFileSync(outputFile, sortedCombinations.slice(0, combinationsToGenerate).join("\n"));
console.log(`Combinations written to ${outputFile}`);
