/**
 * Core framework for Zooming User Interface
 * By Hans Yu
 */

/* ZUI namespace */
function ZUI() {}

/* Div container */
ZUI.container = null;

/* Canvas */
ZUI.canvas = null;

/* Processing handle */
ZUI.processing = null;

/* Frame rate */
ZUI.frameRate = 60;

/* Interface width */
ZUI.width = 900;

/* Interface height */
ZUI.height = 600;

/* Animation object */
ZUI.animation = null;

/* Whether view is to be changed */
ZUI.isChangeView = false;

/* Views and animations before and after change */
ZUI.oldView = null;
ZUI.exitOldViewAnimation = null;
ZUI.newView = null;
ZUI.enterNewViewAnimation = null;

/* Mouse status */
ZUI.mouseStatus = {
	x : 0,
	y : 0,
	xLast : 0,
	yLast : 0,
	leftDown : false,
	middleDown : false,
	rightDown : false,
};

/* Interface background color */
ZUI.background = {
	red : 255,
	green : 255,
	blue : 255,
	alpha : 0
};

/* Active view */
ZUI.activeView = null;

/* Camera */
ZUI.camera = function() {};
	/* Field of view */
	ZUI.camera.fov = Math.PI / 2;

	/* True position */
	ZUI.camera._x = 0;
	ZUI.camera._y = 0;
	ZUI.camera._distance = (ZUI.width / 2) / Math.tan(ZUI.camera.fov / 2);

	/* Move-to position */
	ZUI.camera.x = 0;
	ZUI.camera.y = 0;
	ZUI.camera.distance = ZUI.camera._distance;

	/* Rate at which the camera moves */
	ZUI.camera.moveRate = 1;

	/* Updates camera position */
	ZUI.camera.update = function() {
		ZUI.camera._x += (ZUI.camera.x - ZUI.camera._x) * ZUI.camera.moveRate;
		ZUI.camera._y += (ZUI.camera.y - ZUI.camera._y) * ZUI.camera.moveRate;
		ZUI.camera._distance += (ZUI.camera.distance - ZUI.camera._distance) * ZUI.camera.moveRate;

		if (Math.abs(ZUI.camera.x - ZUI.camera._x) < ZUI.camera._distance * 0.005) ZUI.camera._x = ZUI.camera.x;
		if (Math.abs(ZUI.camera.y - ZUI.camera._y) < ZUI.camera._distance * 0.005) ZUI.camera._y = ZUI.camera.y;
		if (Math.abs(ZUI.camera.distance - ZUI.camera._distance) < ZUI.camera._distance * 0.005) ZUI.camera._distance = ZUI.camera.distance;
	};

	/* Sets position immediately */
	ZUI.camera.setPosition = function(x, y) {
		ZUI.camera._x = x;
		ZUI.camera.x = x;
		ZUI.camera._y = y;
		ZUI.camera.y = y;
	};

	/* Sets x immediately DEPRECATED */
	ZUI.camera.setX = function(x) {
		ZUI.camera._x = x;
		ZUI.camera.x = x;
	};

	/* Sets y immediately DEPRECATED */
	ZUI.camera.setY = function(y) {
		ZUI.camera._y = y;
		ZUI.camera.y = y;
	};

	/* Sets distance immediately */
	ZUI.camera.setDistance = function(distance) {
		ZUI.camera._distance = distance;
		ZUI.camera.distance = distance;
	};

	/* Projects world coordinates to screen coordinates */
	ZUI.camera.projectPoint = function(x, y) {
		var pixelsPerUnit = ZUI.width / (Math.tan(ZUI.camera.fov / 2) * ZUI.camera._distance * 2);
		return {
			x: (x - ZUI.camera._x) * pixelsPerUnit + ZUI.width / 2,
			y: (y - ZUI.camera._y) * pixelsPerUnit + ZUI.height / 2,
		};
	};

	/* Projects world distance to screen distance */
	ZUI.camera.projectDistance = function(distance) {
		var pixelsPerUnit = ZUI.width / (Math.tan(ZUI.camera.fov / 2) * ZUI.camera._distance * 2);
		return distance * pixelsPerUnit;
	};

	/* Unprojects screen coordinates to world coordinates */
	ZUI.camera.unprojectPoint = function(x, y) {
		var pixelsPerUnit = ZUI.width / (Math.tan(ZUI.camera.fov / 2) * ZUI.camera._distance * 2);
		return {
			x: (x - ZUI.width / 2) / pixelsPerUnit + ZUI.camera._x,
			y: (y - ZUI.height / 2) / pixelsPerUnit + ZUI.camera._y,
		};
	};

	/* Unprojects screen distance to world distance */
	ZUI.camera.unprojectDistance = function(distance) {
		var pixelsPerUnit = ZUI.width / (Math.tan(ZUI.camera.fov / 2) * ZUI.camera._distance * 2);
		return distance / pixelsPerUnit;
	};

	/* Resets camera */
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

/* Draws a list of view objects */
ZUI.drawViewObject = function(viewObject) {
	if (viewObject.type == ZUI.ViewObject.Type.Point) {
	}
	else if (viewObject.type == ZUI.ViewObject.Type.Point) {
	}
	else if (viewObject.type == ZUI.ViewObject.Type.Line) {
	}
	else if (viewObject.type == ZUI.ViewObject.Type.Rect) {
		var point = ZUI.camera.projectPoint(viewObject.x, viewObject.y);
		viewObject.screenX = point.x;
		viewObject.screenY = point.y;
		if (viewObject.scale == ZUI.ViewObject.Scale.Screen) {
			viewObject.screenWidth = viewObject.width;
			viewObject.screenHeight = viewObject.height;
		}
		else if (viewObject.scale == ZUI.ViewObject.Scale.World) {
			viewObject.screenWidth = ZUI.camera.projectDistance(viewObject.width);
			viewObject.screenHeight = ZUI.camera.projectDistance(viewObject.height);
		}
		ZUI.processing.rect(viewObject.screenX, viewObject.screenY, viewObject.screenWidth, viewObject.screenHeight);
	}
	else if (viewObject.type == ZUI.ViewObject.Type.RoundedRect) {
		var point = ZUI.camera.projectPoint(viewObject.x, viewObject.y);
		viewObject.screenX = point.x;
		viewObject.screenY = point.y;
		if (viewObject.scale == ZUI.ViewObject.Scale.Screen) {
			viewObject.screenWidth = viewObject.width;
			viewObject.screenHeight = viewObject.height;
			viewObject.screenRadius = viewObject.radius;
		}
		else if (viewObject.scale == ZUI.ViewObject.Scale.World) {
			viewObject.screenWidth = ZUI.camera.projectDistance(viewObject.width);
			viewObject.screenHeight = ZUI.camera.projectDistance(viewObject.height);
			viewObject.screenRadius = ZUI.camera.projectDistance(viewObject.radius);
		}
		ZUI.processing.rect(viewObject.screenX, viewObject.screenY, viewObject.screenWidth, viewObject.screenHeight, viewObject.screenRadius);
	}
	else if (viewObject.type == ZUI.ViewObject.Type.Circle) {
	}
	else if (viewObject.type == ZUI.ViewObject.Type.Ellipse) {
	}
	else if (viewObject.type == ZUI.ViewObject.Type.Triangle) {
	}
	else if (viewObject.type == ZUI.ViewObject.Type.Quad) {
	}
	else if (viewObject.type == ZUI.ViewObject.Type.Polygon) {
	}
	else if (viewObject.type == ZUI.ViewObject.Type.Shape) {
		var point = ZUI.camera.projectPoint(viewObject.x, viewObject.y);
		viewObject.screenX = point.x;
		viewObject.screenY = point.y;
		if (viewObject.scale == ZUI.ViewObject.Scale.Screen) {
			viewObject.screenWidth = viewObject.width;
			viewObject.screenHeight = viewObject.height;
		}
		else if (viewObject.scale == ZUI.ViewObject.Scale.World) {
			viewObject.screenWidth = ZUI.camera.projectDistance(viewObject.width);
			viewObject.screenHeight = ZUI.camera.projectDistance(viewObject.height);
		}
		ZUI.processing.shape(viewObject.shape, viewObject.screenX, viewObject.screenY, viewObject.screenWidth, viewObject.screenHeight);
	}
	else if (viewObject.type == ZUI.ViewObject.Type.Text) {
		var point = ZUI.camera.projectPoint(viewObject.x, viewObject.y);
		viewObject.screenX = point.x;
		viewObject.screenY = point.y;
		//TODO finish this up
	}
};

/* Execute an animation while pausing normal drawing routine */
ZUI.animate = function(animation) {
	this.animation = animation;
	if (this.animation != null) {
		this.animation.reset();
	}
};

/* Converts color hex string to Processing color object */
ZUI.hexToColor = function(hex, alpha) {
	var red = parseInt(hex.substring(1, 3), 16);
	var green = parseInt(hex.substring(3, 5), 16);
	var blue = parseInt(hex.substring(5, 7), 16);
	return ZUI.processing.color(red, green, blue, alpha);
};

/* Converts a number to a string with comma separators */
ZUI.getNumberWithComma = function(number) {
	/* By mikez302, http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript */
	var parts = (number + "").split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts.join(".");
};

/* Converts canvas to an image displayed in a new window */
ZUI.toImageInWindow = function() {
	window.open(ZUI.canvas.toDataURL());
};

/* Attachment function for Processing */
ZUI.sketchProc = function(processing) {
	/* Processing setup */
	processing.setup = function() {
		ZUI.processing = processing;

		/* Set frame rate */
		processing.frameRate(ZUI.frameRate);

		/* Adjust canvas size */
		processing.size(ZUI.width, ZUI.height);

		/* Set background color */
		processing.background(processing.color(ZUI.background.red, ZUI.background.green, ZUI.background.blue, ZUI.background.alpha));

		/* Set text font */
		processing.textFont(processing.loadFont("Helvetica"));
	};

	/* Processing draw */
	processing.draw = function() {
		/* Update */
		ZUI.update();

		/* Clear background */
		processing.background(processing.color(ZUI.background.red, ZUI.background.green, ZUI.background.blue, ZUI.background.alpha));

		if (ZUI.animation == null) {	//No animation
			/* View should be changed */
			if (ZUI.isChangeView) {
				ZUI.activeView.inactive();
				ZUI.activeView = ZUI.newView;
				ZUI.isChangeView = false;
				ZUI.activeView.active();
				ZUI.animate(ZUI.enterNewViewAnimation);
			}
			else {
				/* Call draw function of the active view */
				ZUI.activeView.draw();
			}
		}
		else {		//Animate
			if (!ZUI.animation.isOver()) {
				ZUI.animation.next();
			}
			else {
				ZUI.animation = null;
			}
		}
	};
};

/* Attaches Processing to canvas */
ZUI.attachProcessing = function(canvas) {
	/* Get handles to canvas and container */
	ZUI.canvas = document.getElementById(canvas);
	ZUI.container = ZUI.canvas.parentNode;

	/* Get canvas size */
	ZUI.width = ZUI.canvas.width;
	ZUI.height = ZUI.canvas.height;

	/* Set first view */
	ZUI.activeView = new ZUI.View();

	/* Add listeneres for user input events */
	ZUI.canvas.addEventListener("mousedown", ZUI.mouseDown, false);
	document.addEventListener("mouseup", ZUI.mouseUp, false);
	ZUI.canvas.addEventListener("mousemove", ZUI.mouseMove, false);
	ZUI.canvas.addEventListener("click", ZUI.click, false);
	ZUI.canvas.addEventListener("dblclick", ZUI.doubleClick, false);
	ZUI.canvas.addEventListener("mousewheel", ZUI.mouseWheel, false);
	ZUI.canvas.addEventListener("contextmenu", ZUI.contextMenu, false);

	/* Attach Processing to canvas */
	ZUI.processing = new Processing(ZUI.canvas, ZUI.sketchProc);

	/* Activate first view */
	ZUI.activeView.active();
};

/* Change active view */
ZUI.changeActiveView = function(view, exitAnimation, entryAnimation) {
	ZUI.oldView = ZUI.activeView;
	ZUI.newView = view;
	ZUI.exitOldViewAnimation = exitAnimation;
	ZUI.enterNewViewAnimation = entryAnimation;
	ZUI.isChangeView = true;
	ZUI.animate(ZUI.exitOldViewAnimation);
};

/* Called every frame regardless of view, override with custom function */
ZUI.update = function() {
};

/* Callback for mouse down event */
ZUI.mouseDown = function(event) {
	if (event.button == 0) {
		ZUI.mouseStatus.leftDown = true;
		ZUI.activeView.leftMouseDown();
	}
	else if (event.button == 1) {
		ZUI.mouseStatus.middleDown = true;
		ZUI.activeView.middleMouseDown();
	}
	else if (event.button == 2) {
		ZUI.mouseStatus.rightDown = true;
		ZUI.activeView.rightMouseDown();
	}
	if (ZUI.passInputEvent != null) {
		ZUI.passInputEvent(event);
	}
};

/* Callback for mouse up event */
ZUI.mouseUp = function(event) {
	if (event.button == 0) {
		ZUI.mouseStatus.leftDown = false;
		ZUI.activeView.leftMouseUp();
	}
	else if (event.button == 1) {
		ZUI.mouseStatus.middleDown = false;
		ZUI.activeView.middleMouseUp();
	}
	else if (event.button == 2) {
		ZUI.mouseStatus.rightDown = false;
		ZUI.activeView.rightMouseUp();
	}
	if (ZUI.passInputEvent != null) {
		ZUI.passInputEvent(event);
	}
};

/* Callback for mouse move event */
ZUI.mouseMove = function(event) {
	var mousePosition = ZUI.getMousePosition(event);
	ZUI.mouseStatus.xLast = ZUI.mouseStatus.x;
	ZUI.mouseStatus.yLast = ZUI.mouseStatus.y;
	ZUI.mouseStatus.x = mousePosition.x;
	ZUI.mouseStatus.y = mousePosition.y;
	ZUI.activeView.mouseMove();
	if (ZUI.passInputEvent != null) {
		ZUI.passInputEvent(event);
	}
};

/* Callback for click event */
ZUI.click = function(event) {
	if (event.button == 0) {
		ZUI.activeView.leftClick();
	}
	else if (event.button == 1) {
		ZUI.activeView.middleClick();
	}
	else if (event.button == 2) {
		ZUI.activeView.rightClick();
	}
	if (ZUI.passInputEvent != null) {
		ZUI.passInputEvent(event);
	}
};

/* Callback for double click event */
ZUI.doubleClick = function(event) {
	if (event.button == 0) {
		ZUI.activeView.leftDoubleClick();
	}
	else if (event.button == 1) {
		ZUI.activeView.middleDoubleClick();
	}
	if (ZUI.passInputEvent != null) {
		ZUI.passInputEvent(event);
	}
};

ZUI.mouseWheel = function(event) {
	event.preventDefault();
	var scroll = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
	ZUI.activeView.mouseWheel(scroll);
	if (ZUI.passInputEvent != null) {
		ZUI.passInputEvent(event);
	}
};

/* Callback for context menu event */
ZUI.contextMenu = function(event) {
	if (ZUI.passInputEvent != null) {
		ZUI.passInputEvent(event);
	}
};

/* Overriddable function for passing input events to another element, takes event as parameter */
ZUI.passInputEvent = null;

/* Gets mouse position in screen coordinates */
ZUI.getMousePosition = function(event) {
	var canvasBoundingRect = ZUI.canvas.getBoundingClientRect();
	return {
		x: event.clientX - canvasBoundingRect.left,
		y: event.clientY - canvasBoundingRect.top
	};
};

/* Checks whether a string describes a valid color */
ZUI.isValidColor = function(str) {
	if (!str || !str.match) {
		return null;
	}
	else {
		return str.match(/^#[a-f0-9]{6}$/i) !== null;
	}
};

/* Animation class */
ZUI.Animation = function(frames, drawFrame) {
	this.frames = frames;
	this.drawFrame = drawFrame;
	this.currentFrame = 0;
};

	/* Draw next frame */
	ZUI.Animation.prototype.next = function() {
		this.drawFrame(this.currentFrame);
		this.currentFrame++;
	};

	/* Determines whether animation is over */
	ZUI.Animation.prototype.isOver = function() {
		if (this.currentFrame < this.frames) return false;
		else return true;
	};

	/* Resets animation */
	ZUI.Animation.prototype.reset = function() {
		this.currentFrame = 0;
	};

/* View superclass with abstract and overridable methods */
ZUI.View = function() {};
	ZUI.View.prototype.active = function() {};
	ZUI.View.prototype.inactive = function() {};
	ZUI.View.prototype.draw = function() {};
	ZUI.View.prototype.leftMouseDown = function() {};
	ZUI.View.prototype.middleMouseDown = function() {};
	ZUI.View.prototype.rightMouseDown = function() {};
	ZUI.View.prototype.leftMouseUp = function() {};
	ZUI.View.prototype.middleMouseUp = function() {};
	ZUI.View.prototype.rightMouseUp = function() {};
	ZUI.View.prototype.mouseMove = function() {};
	ZUI.View.prototype.leftClick = function() {};
	ZUI.View.prototype.middleClick = function() {};
	ZUI.View.prototype.rightClick = function() {};
	ZUI.View.prototype.leftDoubleClick = function() {};
	ZUI.View.prototype.middleDoubleClick = function() {};
	ZUI.View.prototype.mouseWheel = function(scroll) {};
	ZUI.View.prototype.getLoadProgress = function() {};		//return Number between 0 and 1, inclusive

/* View object class */
ZUI.ViewObject = function(type, scale, attributes) {
	/* Type of view object, should be one of the definitions in ZUI.ViewObject.Type */
	this.type = type;

	/* Scale, should be one of the definitions in ZUI.ViewObject.Scale  */
	this.scale = scale;

	/* Attributes of view object */
	for (var key in attributes) {
		this[key] = attributes[key];
	}
};

	/* View object types */
	ZUI.ViewObject.Type = {
		Point: 0,
		Line: 1,
		Rect: 2,
		RoundedRect: 3,
		Circle: 4,
		Ellipse: 5,
		Triangle: 6,
		Quad: 7,
		Polygon: 8,
		Shape: 9,
		Text: 10,
	};

	/* Scale */
	ZUI.ViewObject.Scale = {
		Screen: 0,
		World: 1,
	};
