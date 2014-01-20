/**
 * This namespace defines some useful math functions for the framework.
 *
 * Code by Hans Yu
 */

ZUI.Math = {};

/* Calculates the logarithmic of a number for a given base */
ZUI.Math.log = function(number, base) {
	return Math.log(number) / Math.log(base);
};

/* Calculates the real roots of a quadratic function with given coefficients */
ZUI.Math.quadraticRoots = function(p0, p1, p2) {
	/* Discriminant for quadratic formula */
	var D = p1 * p1 - 4 * p0 * p2;

	/* Defining array for roots of the quadratic equation */
	var roots = [];

	/* Cases for solution of quadratic roots */
	if (D == 0) {
		roots.push(-p1 / (2 * p0));
		roots.push(-p1 / (2 * p0));
	}
	else if (D > 0) {
		roots.push((-p1 + Math.sqrt(D)) / (2 * p0));
		roots.push((-p1 - Math.sqrt(D)) / (2 * p0));
	}

	return roots;
};

/* Calculates the real roots of a cubic function with given coefficients */
ZUI.Math.cubicRoots = function(p0, p1, p2, p3) {
	/* Check for p0 = 0 */
	if (p0 == 0) return ZUI.Geometry.quadraticRoots(p1, p2, p3);

	/* Coefficients after normalizing the first coefficient of the previously mentioned function to one */
	var C0 = p1 / p0;
	var C1 = p2 / p0;
	var C2 = p3 / p0;

	/* Constants of an intermediate step in solving the roots of the cubic function */
	var Q = (3 * C1 - Math.pow(C0, 2)) / 9;
	var R = (9 * C0 * C1 - 27 * C2 - 2 * Math.pow(C0, 3)) / 54;
	var D = Math.pow(Q, 3) + Math.pow(R, 2);

	/* Defining array for roots of the cubic function */
	var roots = [];

	/* Cases for solutions of cubic roots */
	if (D == 0) {
		var S = Math.pow(R, (1 / 3));
		roots.push(-C0 / 3 + 2 * S);
		roots.push(-C0 / 3 - S);
	}
	else if (D > 0) {
		var num = R + Math.sqrt(D);
		var S = ((num > 0) ? 1 : -1) * Math.pow(Math.abs(num), (1 / 3));
		num = R - Math.sqrt(D);
		var T = ((num > 0) ? 1 : -1) * Math.pow(Math.abs(num), (1 / 3));
		roots.push(-C0 / 3 + (S + T));
	}
	else {
		var theta = Math.acos(R / Math.sqrt(-Q * Q * Q));
		roots.push(2 * Math.sqrt(-Q) * Math.cos(theta / 3) - C0 / 3);
		roots.push(2 * Math.sqrt(-Q) * Math.cos((theta + 2 * Math.PI) / 3) - C0 / 3);
		roots.push(2 * Math.sqrt(-Q) * Math.cos((theta + 4 * Math.PI) / 3) - C0 / 3);
	}

	return roots;
};
