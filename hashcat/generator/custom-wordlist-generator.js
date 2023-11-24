const fs = require("fs");
const config = require("../../config");

// Function to generate permutations of a given array of words
function generatePermutations(words, maxWordsUsed) {
	const permutations = [];

	// Helper function to swap elements in an array
	function swap(arr, i, j) {
		const temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}

	// Helper function to generate permutations using backtracking
	function generate(index, k) {
		if (index === k - 1) {
			// Add the current permutation to the result
			permutations.push(words.slice(0, k).join(''));
			return;
		}

		for (let i = index; i < words.length; i++) {
			// Swap elements to create a new permutation
			swap(words, index, i);
			// Recursively generate permutations for the remaining elements
			generate(index + 1, k);
			// Swap back to backtrack
			swap(words, index, i);
		}
	}

	// Generate permutations for different values of k up to maxWordsUsed
	for (let k = 1; k <= Math.min(maxWordsUsed, words.length); k++) {
		generate(0, k);
	}

	return permutations;
}

// Example usage with the provided list
const initialWords = config.WORD_LIST;
const result = generatePermutations(initialWords, config.MAX_WORDS_USED);

// Custom sorting function based on config variables
const customSort = (a, b) => {
	if (config.SORT_BY_LENGTH) {
		if (a.length !== b.length) {
			return config.SORT_LENGTH_ASCENDING ? a.length - b.length : b.length - a.length;
		}
	}

	return config.SORT_ALPHABETICALLY ? a.localeCompare(b) : 0;
};

// Sort permutations using the custom sorting function
const sortedResult = result.sort(customSort);

// Filter permutations based on config variables for min/max length
const filteredResult = sortedResult.filter((perm) => {
	const length = perm.length;
	return (!config.MIN_LENGTH || length >= config.MIN_LENGTH) && (!config.MAX_LENGTH || length <= config.MAX_LENGTH);
});

// Print count of unique permutations generated in the terminal
console.log(`Generated ${filteredResult.length} unique permutations.`);

// Print specified number of items in the terminal
const itemsToPrint = Math.min(config.PRINT_ITEMS, filteredResult.length);
console.log(`Printing ${itemsToPrint} items:`);
console.log(filteredResult.slice(0, itemsToPrint));

// Write the specified number of permutations to a file
const permutationsToGenerate = config.GENERATE_PERMUTATIONS;
const outputFile = config.EXPORT_FILE_NAME;

// Sort permutations alphabetically before writing to the file
const sortedPermutations = filteredResult.sort(customSort);
fs.writeFileSync(outputFile, sortedPermutations.slice(0, permutationsToGenerate).join("\n"));
console.log(`Permutations written to ${outputFile}`);
