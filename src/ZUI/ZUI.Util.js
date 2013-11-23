ZUI.Util = {};

/* Gets mouse screen coordinates */
ZUI.getMousePosition = function(event) {
	var canvasBoundingRect = ZUI.canvas.getBoundingClientRect();
	return {
		x: event.clientX - canvasBoundingRect.left,
		y: event.clientY - canvasBoundingRect.top
	};
};

/* Checks whether the given string is a valid color */
ZUI.isValidColor = function(str) {
	if (!str || !str.match) {
		return null;
	}
	else {
		return str.match(/^#[a-f0-9]{6}$/i) !== null;
	}
};

/* Checks whether the given string ends with the given suffix */
ZUI.endsWith = function(str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

/* Converts number to string with comma separators */
ZUI.getNumberWithComma = function(number) {
	/* By mikez302, http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript */
	var parts = (number + "").split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts.join(".");
};

/* Converts canvas to image and display in new window */
ZUI.toImageInWindow = function() {
	window.open(ZUI.canvas.toDataURL());
};

ZUI.Util.regexIndexOf = function(string, regex, start) {
	var index = string.substring(start || 0).search(regex);
	return (index >= 0) ? (index + (start || 0)) : index;
};
