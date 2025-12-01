/**
 * Get unique pairs.
 *
 * @param {Array} array - The array.
 * @returns {Array} - The unique pairs.
 */
function uniquePairs(array) {
	if (!Array.isArray(array)) {
		throw new TypeError("First argument must be an array");
	}

	if (array.length < 3) {
		return [array];
	}

	return array.reduce(
		(previousValue, currentValue, index) =>
			previousValue.concat(array.slice(index + 1).map((value) => [currentValue, value])),
		[]
	);
}

/**
 * Tests
 */
const assert = require("assert");

assert.deepEqual(uniquePairs([]), [[]]);
assert.deepEqual(uniquePairs([1]), [[1]]);
assert.deepEqual(uniquePairs([1, 2]), [[1, 2]]);

assert.deepEqual(uniquePairs([1, 2, 3]), [
	[1, 2],
	[1, 3],
	[2, 3],
]);

assert.deepEqual(uniquePairs([1, 2, 3, 4]), [
	[1, 2],
	[1, 3],
	[1, 4],
	[2, 3],
	[2, 4],
	[3, 4],
]);

console.log("Passed!");
