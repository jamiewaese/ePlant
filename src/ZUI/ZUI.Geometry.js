ZUI.Geometry = {};

ZUI.Geometry.intersectHRayLine = function(x, y, vx, vy, x0, y0, x1, y1) {
	/* Coefficients for equation of line */
	var A = vy;
	var B = -vx;
	var C = y * vx - x * vy;

	/* Calculate numerator and denominator of solution */
	var num = A * x0 + B * y0 + C;
	var den = A * (x0 - x1) + B * (y0 - y1);

	/* Avoid division by zero (parallel lines) */
	if (den == 0) {
		if (y0 == y) {
			if (x0 >= x || x1 >= x) {
/*				return {
					case: "overlap",
					intersect: {}
				}*/
				if (x0 <= x || x1 <= x) {
					return {
						x: x,
						y: y
					}
				}
			}
/*			else {
				return {
					case: "overlap out of range",
					intersect: {}
				}
			}*/
		}
/*		else {
			return {
				case: "parallel no overlap",
				intersect: {}
			}
		}*/
		return {};
	}

	/* Calculate intersection point, if any */
	var t = num / den;
	var xIntersect = (1 - t) * x0 + t * x1;
	var yIntersect = (1 - t) * y0 + t * y1;
	var vxSign = (vx > 0) ? 1 : -1;
	var vySign = (vy > 0) ? 1 : -1;
	if (xIntersect * vxSign < x * vxSign || yIntersect * vySign < y * vySign || t < 0 || t > 1) {
/*		return {
			case: "no intersect",
			intersect: {}
		}*/
		return {};
	}
	else {
/*		return {
			case: "intersect",
			intersect: {
				x: xIntersect,
				y: yIntersect
			}
		}*/
		return {
			x: xIntersect,
			y: yIntersect
		};
	}
};

ZUI.Geometry.quadraticRoots = function(p0, p1, p2) {
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

ZUI.Geometry.cubicRoots = function(p0, p1, p2, p3) {
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

ZUI.Geometry.intersectHRayQuadraticBezier = function(x, y, vx, vy, x0, y0, x1, y1, x2, y2) {
	/* Coefficients for equation of line */
	var A = vy;
	var B = -vx;
	var C = y * vx - x * vy;

	/* Coefficients of Bezier after converting to quadratic function */
	var bx0 = x0 - 2 * x1 + x2;
	var by0 = y0 - 2 * y1 + y2;
	var bx1 = -2 * x0 + 2 * x1;
	var by1 = -2 * y0 + 2 * y1;
	var bx2 = x0;
	var by2 = y0;

	/* Coefficients of quadratic function after substituting Bezier into line */
	var p0 = A * bx0 + B * by0;
	var p1 = A * bx1 + B * by1;
	var p2 = A * bx2 + B * by2 + C;

	var t = ZUI.Geometry.quadraticRoots(p0, p1, p2);

	/* Calculate intersection points */
	var solutions = [];
	var vxSign = (vx > 0) ? 1 : -1;
	var vySign = (vy > 0) ? 1 : -1;
	for (var n = 0; n < t.length; n++) {
		var xIntersect = bx0 * Math.pow(t[n], 2) + bx1 * t[n] + bx2;
		var yIntersect = by0 * Math.pow(t[n], 2) + by1 * t[n] + by2;
		if (!(xIntersect * vxSign < x * vxSign || yIntersect * vySign < y * vySign || t[n] < 0 || t[n] > 1)) {
			solutions.push({
				x: xIntersect,
				y: yIntersect
			});
		}
	}

	return solutions;
};

ZUI.Geometry.intersectHRayCubicBezier = function(x, y, vx, vy, x0, y0, x1, y1, x2, y2, x3, y3) {
	/* Coefficients for equation of line */
	var A = vy;
	var B = -vx;
	var C = y * vx - x * vy;

	/* Coefficients of Bezier after converting to cubic function */
	var bx0 = -x0 + 3 * x1 - 3 * x2 + x3;
	var by0 = -y0 + 3 * y1 - 3 * y2 + y3;
	var bx1 = 3 * x0 - 6 * x1 + 3 * x2;
	var by1 = 3 * y0 - 6 * y1 + 3 * y2;
	var bx2 = -3 * x0 + 3 * x1;
	var by2 = -3 * y0 + 3 * y1;
	var bx3 = x0;
	var by3 = y0;

	/* Coefficients of cubic function after substituting Bezier into line */
	var p0 = A * bx0 + B * by0;
	var p1 = A * bx1 + B * by1;
	var p2 = A * bx2 + B * by2;
	var p3 = A * bx3 + B * by3 + C;

	var t = ZUI.Geometry.cubicRoots(p0, p1, p2, p3);

	/* Calculate intersection points */
	var solutions = [];
	var vxSign = (vx > 0) ? 1 : -1;
	var vySign = (vy > 0) ? 1 : -1;
	for (var n = 0; n < t.length; n++) {
		var xIntersect = bx0 * Math.pow(t[n], 3) + bx1 * Math.pow(t[n], 2) + bx2 * t[n] + bx3;
		var yIntersect = by0 * Math.pow(t[n], 3) + by1 * Math.pow(t[n], 2) + by2 * t[n] + by3;
		if (!(xIntersect * vxSign < x * vxSign || yIntersect * vySign < y * vySign || t[n] < 0 || t[n] > 1)) {
			solutions.push({
				x: xIntersect,
				y: yIntersect
			});
		}
	}

	return solutions;
};

