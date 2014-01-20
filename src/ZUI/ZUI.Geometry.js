/**
 * This namespace defines some useful geometry functions for the framework.
 *
 * Code by Hans Yu
 */

ZUI.Geometry = {};

/* Finds the intersect between a ray and a line */
ZUI.Geometry.intersectRayLine = function(x, y, vx, vy, x0, y0, x1, y1) {
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
				if (x0 <= x || x1 <= x) {
					return {
						x: x,
						y: y
					}
				}
			}
		}
		return {};
	}

	/* Calculate intersection point, if any */
	var t = num / den;
	var xIntersect = (1 - t) * x0 + t * x1;
	var yIntersect = (1 - t) * y0 + t * y1;
	var vxSign = (vx > 0) ? 1 : -1;
	var vySign = (vy > 0) ? 1 : -1;
	if (xIntersect * vxSign < x * vxSign || yIntersect * vySign < y * vySign || t < 0 || t > 1) {
		return {};
	}
	else {
		return {
			x: xIntersect,
			y: yIntersect
		};
	}
};

/* Finds the intersect between a ray and a quadratic Bezier curve */
ZUI.Geometry.intersectRayQuadraticBezier = function(x, y, vx, vy, x0, y0, x1, y1, x2, y2) {
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

	var t = ZUI.Math.quadraticRoots(p0, p1, p2);

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

/* Finds the intersect between a ray and a cubic Bezier curve */
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

	var t = ZUI.Math.cubicRoots(p0, p1, p2, p3);

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
