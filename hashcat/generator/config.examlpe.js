module.exports = {
	// General configurations
	printItems: 10, // Number of items to print in the terminal
	generatePermutations: 2000, // Number of permutations to generate and add to the .txt file
	exportFileName: "./hashcat/wordlists/generated-passwords.txt", // Name of the exported file
	wordList: [], // List of words for generation
	maxWordsUsed: 6, // Max number of words that can be combined to form a given string

	// Sorting configurations
	sortByLength: true, // Whether to sort permutations by length
	sortLengthAscending: true, // If sorting by length, whether to sort in ascending order
	sortAlphabetically: true, // Whether to sort alphabetically

	// Length constraints for generated strings
	minLength: 8, // Minimum length of generated strings
	maxLength: 35 // Maximum length of generated strings
};
