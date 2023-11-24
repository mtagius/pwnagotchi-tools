const fs = require("fs");
const config = require("./config");

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
const initialWords = config.wordList;
const result = generatePermutations(initialWords, config.maxWordsUsed);

// Print count of unique permutations generated in the terminal
console.log(`Generated ${result.length} unique permutations.`);

// Sort permutations alphabetically
const sortedResult = result.sort();

// Print specified number of items in the terminal
const itemsToPrint = Math.min(config.printItems, sortedResult.length);
console.log(`Printing ${itemsToPrint} items:`);
console.log(sortedResult.slice(0, itemsToPrint));

// Write the specified number of permutations to a file
const permutationsToGenerate = config.generatePermutations;
const outputFile = config.exportFileName;

// Sort permutations alphabetically before writing to the file
const sortedPermutations = result.sort();
fs.writeFileSync(outputFile, sortedPermutations.slice(0, permutationsToGenerate).join("\n"));
console.log(`Permutations written to ${outputFile}`);
