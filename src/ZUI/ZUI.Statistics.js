/**
 * This namespace defines some useful statistics functions for the framework.
 *
 * Code by Hans Yu
 */

ZUI.Statistics = {};

/* Calculates the mean of an array of numbers */
ZUI.Statistics.mean = function(numbers) {
	var sum = 0;
	for (var n = 0; n < numbers.length; n++) {
		sum += numbers[n];
	}
	return sum / numbers.length;
};

/* Calculates the standard deviation of an array of numbers */
ZUI.Statistics.stdev = function(numbers) {
	if (numbers.length < 2) return Number.NaN;
	var mean = ZUI.Statistics.mean(numbers);
	var sqsum = 0;
	for (var n = 0; n < numbers.length; n++) {
		sqsum += Math.pow(mean - numbers[n], 2);
	}
	return Math.sqrt(sqsum / (numbers.length - 1));
};

/* Calculates the standard error of an array of numbers */
ZUI.Statistics.sterror = function(numbers) {
	if (numbers.length < 2) return Number.NaN;
	return ZUI.Statistics.stdev(numbers) / Math.sqrt(numbers.length);
};
