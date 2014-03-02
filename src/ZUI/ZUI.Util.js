/**
 * This namespace defines some useful utility functions for the framework.
 *
 * Code by Hans Yu
 */

ZUI.Util = {};

/* Checks whether the given string is a valid color */
ZUI.Util.isValidColor = function(str) {
	if (!str || !str.match) {
		return null;
	}
	else {
		return str.match(/^#[a-f0-9]{6}$/i) !== null;
	}
};

/* Checks whether the given string ends with the given suffix */
ZUI.Util.endsWith = function(str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

/* Converts number to string with comma separators */
ZUI.Util.getNumberWithComma = function(number) {
	/* By mikez302, http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript */
	var parts = (number + "").split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts.join(".");
};

/* Converts canvases in the ZUI container to image and display in new window */
ZUI.Util.toImageInWindow = function(canvas) {
	if (!canvas) {
		window.open(ZUI.canvas.toDataURL());
	}
	else {
		window.open(canvas.toDataURL());
	}
};

/* Gets the index of a regular expression for a string */
ZUI.Util.regexIndexOf = function(string, regex, start) {
	var index = string.substring(start || 0).search(regex);
	return (index >= 0) ? (index + (start || 0)) : index;
};

/* Gets the current time */
ZUI.Util.getTime = function() {
	return (new Date()).getTime();
};

/* Stops the bubbling of a DOM event */
ZUI.Util.stopBubble = function(event) {
	event.stopPropagation();
};

/* Makes color string from color components */
ZUI.Util.makeColorString = function(red, green, blue) {
	if (red.red !== undefined && red.green !== undefined && red.blue !== undefined) {
		var color = red;
		red = color.red;
		green = color.green;
		blue = color.blue;
	}
	var _red = red.toString(16);
	if (_red.length == 1) _red = "0" + _red;
	var _green = green.toString(16);
	if (_green.length == 1) _green = "0" + _green;
	var _blue = blue.toString(16);
	if (_blue.length == 1) _blue = "0" + _blue;
	return "#" + _red + _green + _blue;
};

/* Gets color components from a color string */
ZUI.Util.getColorComponents = function(color) {
	var _color = color.substring(0);
	if (_color[0] == "#") {
		_color = color.substring(1);
	}
	var red = parseInt(_color.substring(0, 2), 16);
	var green = parseInt(_color.substring(2, 4), 16);
	var blue = parseInt(_color.substring(4, 6), 16);
	if (isNaN(red) || isNaN(green) || isNaN(blue)) {
		return null;
	}
	else {
		return {
			red: red,
			green: green,
			blue: blue
		};
	}
};

/* Makes the child class inherit from the parent class */
ZUI.Util.inheritClass = function(parent, child) {
	function protoCreator() {
		this.constructor = child.prototype.constructor;
	}
	protoCreator.prototype = parent.prototype;
	child.prototype = new protoCreator();
};

/* Interprets a string representing a class path and returns the actual class */
ZUI.Util.readClassPath = function(classPath) {
	var parts = classPath.split(".");
	var scope = window;
	for (var n = 0; n < parts.length; n++) {
		scope = scope[parts[n]];
		if (scope === undefined || scope === null) {
			console.log("Warning: The class path " + classPath + " cannot be found.");
			return undefined;
		}
	}
	return scope;
};
