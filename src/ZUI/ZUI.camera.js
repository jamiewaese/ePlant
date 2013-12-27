/**
 * Camera object for ZUI framework
 * By Hans Yu
 */

/* Define object */
ZUI.camera = {};

/* Attributes */
ZUI.camera.private = {};

ZUI.camera.private.fov = Math.PI / 2;	// Field of view
Object.defineProperty(ZUI.camera, "fov", {
	get: function() {
		return ZUI.camera.private.fov;
	},
	set: function(value) {
		ZUI.camera.private.fov = value;
	}
});

ZUI.camera.private._x = 0;			// True x position
Object.defineProperty(ZUI.camera, "_x", {
	get: function() {
		return ZUI.camera.private._x;
	},
	set: function(value) {
		ZUI.camera.private._x = value;
		for (var n = 0; n < ZUI.viewObjects.length; n++) {
			ZUI.viewObjects[n].redraw = true;
		}
	}
});

ZUI.camera.private._y = 0;			// True y position
Object.defineProperty(ZUI.camera, "_y", {
	get: function() {
		return ZUI.camera.private._y;
	},
	set: function(value) {
		ZUI.camera.private._y = value;
		for (var n = 0; n < ZUI.viewObjects.length; n++) {
			ZUI.viewObjects[n].redraw = true;
		}
	}
});

ZUI.camera.private._distance = (ZUI.width / 2) / Math.tan(ZUI.camera.fov / 2);	// True distance
Object.defineProperty(ZUI.camera, "_distance", {
	get: function() {
		return ZUI.camera.private._distance;
	},
	set: function(value) {
		ZUI.camera.private._distance = value;
		for (var n = 0; n < ZUI.viewObjects.length; n++) {
			ZUI.viewObjects[n].redraw = true;
		}
	}
});

ZUI.camera.private.x = 0;			// Target x position
Object.defineProperty(ZUI.camera, "x", {
	get: function() {
		return ZUI.camera.private.x;
	},
	set: function(value) {
		ZUI.camera.private.x = value;
	}
});

ZUI.camera.private.y = 0;			// Target y position
Object.defineProperty(ZUI.camera, "y", {
	get: function() {
		return ZUI.camera.private.y;
	},
	set: function(value) {
		ZUI.camera.private.y = value;
	}
});

ZUI.camera.private.distance = ZUI.camera._distance;	// Target distance
Object.defineProperty(ZUI.camera, "distance", {
	get: function() {
		return ZUI.camera.private.distance;
	},
	set: function(value) {
		ZUI.camera.private.distance = value;
	}
});

ZUI.camera.private.moveRate = 1;		// Rate at which the camera moves to its target
Object.defineProperty(ZUI.camera, "moveRate", {
	get: function() {
		return ZUI.camera.private.moveRate;
	},
	set: function(value) {
		ZUI.camera.private.moveRate = value;
	}
});

ZUI.camera.private.autoUpdate = false;	// Whether camera is updated automatically at every frame
Object.defineProperty(ZUI.camera, "autoUpdate", {
	get: function() {
		return ZUI.camera.private.autoUpdate;
	},
	set: function(value) {
		ZUI.camera.private.autoUpdate = value;
	}
});

/* Update camera */
ZUI.camera.update = function() {
	if (ZUI.camera._x != ZUI.camera.x) {
		ZUI.camera._x += (ZUI.camera.x - ZUI.camera._x) * ZUI.camera.moveRate;
		if (Math.abs(ZUI.camera.x - ZUI.camera._x) < ZUI.camera._distance * 0.005) ZUI.camera._x = ZUI.camera.x;
	}

	if (ZUI.camera._y != ZUI.camera.y) {
		ZUI.camera._y += (ZUI.camera.y - ZUI.camera._y) * ZUI.camera.moveRate;
		if (Math.abs(ZUI.camera.y - ZUI.camera._y) < ZUI.camera._distance * 0.005) ZUI.camera._y = ZUI.camera.y;
	}

	if (ZUI.camera._distance != ZUI.camera.distance) {
		ZUI.camera._distance += (ZUI.camera.distance - ZUI.camera._distance) * ZUI.camera.moveRate;
		if (Math.abs(ZUI.camera.distance - ZUI.camera._distance) < ZUI.camera._distance * 0.005) ZUI.camera._distance = ZUI.camera.distance;
	}
};

/* Set true x and y positions */
ZUI.camera.setPosition = function(x, y) {
	ZUI.camera._x = x;
	ZUI.camera.x = x;
	ZUI.camera._y = y;
	ZUI.camera.y = y;
};

/* Set true distance */
ZUI.camera.setDistance = function(distance) {
	ZUI.camera._distance = distance;
	ZUI.camera.distance = distance;
};

/* Project world coordinates to screen coordinates */
ZUI.camera.projectPoint = function(x, y) {
	var pixelsPerUnit = ZUI.width / (Math.tan(ZUI.camera.fov / 2) * ZUI.camera._distance * 2);
	return {
		x: (x - ZUI.camera._x) * pixelsPerUnit + ZUI.width / 2,
		y: (y - ZUI.camera._y) * pixelsPerUnit + ZUI.height / 2,
	};
};

/* Project world distance to screen distance */
ZUI.camera.projectDistance = function(distance) {
	var pixelsPerUnit = ZUI.width / (Math.tan(ZUI.camera.fov / 2) * ZUI.camera._distance * 2);
	return distance * pixelsPerUnit;
};

/* Unproject screen coordinates to world coordinates */
ZUI.camera.unprojectPoint = function(x, y) {
	var pixelsPerUnit = ZUI.width / (Math.tan(ZUI.camera.fov / 2) * ZUI.camera._distance * 2);
	return {
		x: (x - ZUI.width / 2) / pixelsPerUnit + ZUI.camera._x,
		y: (y - ZUI.height / 2) / pixelsPerUnit + ZUI.camera._y,
	};
};

/* Unproject screen distance to world distance */
ZUI.camera.unprojectDistance = function(distance) {
	var pixelsPerUnit = ZUI.width / (Math.tan(ZUI.camera.fov / 2) * ZUI.camera._distance * 2);
	return distance / pixelsPerUnit;
};

/* Reset camera */
ZUI.camera.reset = function() {
	/* True position */
	ZUI.camera._x = 0;
	ZUI.camera._y = 0;
	ZUI.camera._distance = (ZUI.width / 2) / Math.tan(ZUI.camera.fov / 2);

	/* Move-to position */
	ZUI.camera.x = 0;
	ZUI.camera.y = 0;
	ZUI.camera.distance = ZUI.camera._distance;
};