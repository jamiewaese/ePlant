ZUI.Statistics = {};

ZUI.Statistics.mean = function(numbers) {
	var sum = 0;
	for (var n = 0; n < numbers.length; n++) {
		sum += numbers[n];
	}
	return sum;
};

ZUI.Statistics.stdev = function(numbers) {
	var mean = ZUI.Statistics.mean(numbers);
	var sqsum = 0;
	for (var n = 0; n < numbers.length; n++) {
		sqsum += Math.pow(mean - numbers[n], 2);
	}
	return Math.sqrt(sqsum / (numbers.length - 1));
};