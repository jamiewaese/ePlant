/**
 * This namespace defines some useful parser functions for the framework.
 *
 * Code by Hans Yu
 */

ZUI.Parser = {};

/* Parses an SVG path to an array of instruction objects with properties that allow for convenient usage in a canvas */
ZUI.Parser.pathToObj = function(path) {
	/* Splits the path string into instructions */
	var instructions = [];
	for (var n = 0; n + 1 < path.length;) {
		var instruction = path[n];
		var next = ZUI.Util.regexIndexOf(path, "[A-Za-z]", n + 1);
		if (next < 0) next = path.length;
		var args = path.substring(n + 1, next).replace(new RegExp("([0-9])-", "gi"), "$1,-").trim().replace(new RegExp("[\t\n ,]+", "gi"), ",").split(/[,]+/);
		for (var m = 0; m < args.length; m++) {
			args[m] = Number(args[m]);
		}
		instructions.push({
			instruction: instruction,
			args: args
		});
		n = next;
	}

	/* Process instructions */
	var objs = []
	var lastX = 0, lastY = 0;
	for (n = 0; n < instructions.length; n++) {
		if (instructions[n].instruction == "M") {			// moveto (absolute)
			var obj = {};
			obj.instruction = "moveTo";
			obj.args = [instructions[n].args[0], instructions[n].args[1]];
			objs.push(obj);
			lastX = instructions[n].args[0];
			lastY = instructions[n].args[1];
		}
		else if (instructions[n].instruction == "m") {		// moveto (relative)
			var obj = {};
			obj.instruction = "moveTo";
			obj.args = [instructions[n].args[0] + lastX, instructions[n].args[1] + lastY];
			objs.push(obj);
			lastX += instructions[n].args[0];
			lastY += instructions[n].args[1];
		}
		else if (instructions[n].instruction == "Z" || instructions[n].instruction == "z") {	// closepath
			var obj = {};
			obj.instruction = "closePath";
			obj.args = [];
			objs.push(obj);
		}
		else if (instructions[n].instruction == "L") {		// lineto (absolute)
			var obj = {};
			obj.instruction = "lineTo";
			obj.args = [instructions[n].args[0], instructions[n].args[1]];
			objs.push(obj);
			lastX = instructions[n].args[0];
			lastY = instructions[n].args[1];
		}
		else if (instructions[n].instruction == "l") {		// lineto (relative)
			var obj = {};
			obj.instruction = "lineTo";
			obj.args = [instructions[n].args[0] + lastX, instructions[n].args[1] + lastY];
			objs.push(obj);
			lastX += instructions[n].args[0];
			lastY += instructions[n].args[1];
		}
		else if (instructions[n].instruction == "H") {		// horizontal lineto (absolute)
			var obj = {};
			obj.instruction = "lineTo";
			obj.args = [instructions[n].args[0], lastY];
			objs.push(obj);
			lastX = instructions[n].args[0];
		}
		else if (instructions[n].instruction == "h") {		// horizontal lineto (relative)
			var obj = {};
			obj.instruction = "lineTo";
			obj.args = [instructions[n].args[0] + lastX, lastY];
			objs.push(obj);
			lastX += instructions[n].args[0];
		}
		else if (instructions[n].instruction == "V") {		// vertical lineto (absolute)
			var obj = {};
			obj.instruction = "lineTo";
			obj.args = [lastX, instructions[n].args[0]];
			objs.push(obj);
			lastY = instructions[n].args[0];
		}
		else if (instructions[n].instruction == "v") {		// vertical lineto (relative)
			var obj = {};
			obj.instruction = "lineTo";
			obj.args = [lastX, instructions[n].args[0] + lastY];
			objs.push(obj);
			lastY += instructions[n].args[0];
		}
		else if (instructions[n].instruction == "C") {		// curveto (absolute)
			var obj = {};
			obj.instruction = "bezierCurveTo";
			obj.args = [instructions[n].args[0], instructions[n].args[1], instructions[n].args[2], instructions[n].args[3], instructions[n].args[4], instructions[n].args[5]];
			objs.push(obj);
			lastX = instructions[n].args[4];
			lastY = instructions[n].args[5];
		}
		else if (instructions[n].instruction == "c") {		// curveto (relative)
			var obj = {};
			obj.instruction = "bezierCurveTo";
			obj.args = [instructions[n].args[0] + lastX, instructions[n].args[1] + lastY, instructions[n].args[2] + lastX, instructions[n].args[3] + lastY, instructions[n].args[4] + lastX, instructions[n].args[5] + lastY];
			objs.push(obj);
			lastX += instructions[n].args[4];
			lastY += instructions[n].args[5];
		}
		else if (instructions[n].instruction == "S") {		// shorthand/smooth curveto (absolute)
			var obj = {};
			obj.instruction = "bezierCurveTo";
			obj.args = [lastX, lastY, instructions[n].args[0], instructions[n].args[1], instructions[n].args[2], instructions[n].args[3]];
			objs.push(obj);
			lastX = instructions[n].args[2];
			lastY = instructions[n].args[3];
		}
		else if (instructions[n].instruction == "s") {		// shorthand/smooth curveto (relative)
			var obj = {};
			obj.instruction = "bezierCurveTo";
			obj.args = [lastX, lastY, instructions[n].args[0] + lastX, instructions[n].args[1] + lastY, instructions[n].args[2] + lastX, instructions[n].args[3] + lastY];
			objs.push(obj);
			lastX += instructions[n].args[2];
			lastY += instructions[n].args[3];
		}
		else if (instructions[n].instruction == "Q") {		// quadratic Bezier curveto (absolute)
			var obj = {};
			obj.instruction = "quadraticCurveTo";
			obj.args = [instructions[n].args[0], instructions[n].args[1], instructions[n].args[2], instructions[n].args[3]];
			objs.push(obj);
			lastX = instructions[n].args[2];
			lastY = instructions[n].args[3];
		}
		else if (instructions[n].instruction == "q") {		// quadratic Bezier curveto (relative)
			var obj = {};
			obj.instruction = "quadraticCurveTo";
			obj.args = [instructions[n].args[0] + lastX, instructions[n].args[1] + lastY, instructions[n].args[2] + lastX, instructions[n].args[3] + lastY];
			objs.push(obj);
			lastX += instructions[n].args[2];
			lastY += instructions[n].args[3];
		}
		else if (instructions[n].instruction == "T") {		// shorthand/smooth quadratic Bezier curveto (absolute)
			var obj = {};
			obj.instruction = "quadraticCurveTo";
			obj.args = [lastX, lastY, instructions[n].args[0], instructions[n].args[1]];
			objs.push(obj);
			lastX = instructions[n].args[0];
			lastY = instructions[n].args[1];
		}
		else if (instructions[n].instruction == "t") {		// shorthand/smooth quadratic Bezier curveto (relative)
			var obj = {};
			obj.instruction = "quadraticCurveTo";
			obj.args = [lastX, lastY, instructions[n].args[0] + lastX, instructions[n].args[1] + lastY];
			objs.push(obj);
			lastX += instructions[n].args[0];
			lastY += instructions[n].args[1];
		}
		else if (instructions[n].instruction == "A") {		// elliptical arc (absolute), NOT THE SAME AS THE SVG COMMAND
			var obj = {};
			obj.instruction = "arcTo";
			obj.args = [instructions[n].args[0], instructions[n].args[1], instructions[n].args[2], instructions[n].args[3], instructions[n].args[4]];
			objs.push(obj);
			lastX = instructions[n].args[2];
			lastY = instructions[n].args[3];
		}
		else if (instructions[n].instruction == "a") {		// elliptical arc (relative), NOT THE SAME AS THE SVG COMMAND
			var obj = {};
			obj.instruction = "arcTo";
			obj.args = [instructions[n].args[0] + lastX, instructions[n].args[1] + lastY, instructions[n].args[2] + lastX, instructions[n].args[3] + lastY, instructions[n].args[4]];
			objs.push(obj);
			lastX += instructions[n].args[2];
			lastY += instructions[n].args[3];
		}
	}

	return objs;
};