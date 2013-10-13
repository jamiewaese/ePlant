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
ZUI.width = 800;

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
	ZUI.camera.moveRate = 0.1;

	/* Updates camera position */
	ZUI.camera.update = function() {
		ZUI.camera._x += (ZUI.camera.x - ZUI.camera._x) * ZUI.camera.moveRate;
		ZUI.camera._y += (ZUI.camera.y - ZUI.camera._y) * ZUI.camera.moveRate;
		ZUI.camera._distance += (ZUI.camera.distance - ZUI.camera._distance) * ZUI.camera.moveRate;
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
	if (viewObject.type == ZUI.ViewObject.Type.POINT) {
	}
	else if (viewObject.type == ZUI.ViewObject.Type.POINT) {
	}
	else if (viewObject.type == ZUI.ViewObject.Type.LINE) {
	}
	else if (viewObject.type == ZUI.ViewObject.Type.RECT) {
		var point = ZUI.camera.projectPoint(viewObject.attributes.x, viewObject.attributes.y);
		viewObject.attributes.screenX = point.x;
		viewObject.attributes.screenY = point.y;
		viewObject.attributes.screenWidth = ZUI.camera.projectDistance(viewObject.attributes.width);
		viewObject.attributes.screenHeight = ZUI.camera.projectDistance(viewObject.attributes.height);
		viewObject.screenX = point.x;
		viewObject.screenY = point.y;
		viewObject.screenWidth = ZUI.camera.projectDistance(viewObject.attributes.width);
		viewObject.screenHeight = ZUI.camera.projectDistance(viewObject.attributes.width);
		ZUI.processing.rect(viewObject.attributes.screenX, viewObject.attributes.screenY, viewObject.attributes.screenWidth, viewObject.attributes.screenHeight);
	}
	else if (viewObject.type == ZUI.ViewObject.Type.ROUNDED_RECT) {
		var point = ZUI.camera.projectPoint(viewObject.attributes.x, viewObject.attributes.y);
		viewObject.attributes.screenX = point.x;
		viewObject.attributes.screenY = point.y;
		viewObject.attributes.screenWidth = ZUI.camera.projectDistance(viewObject.attributes.width);
		viewObject.attributes.screenHeight = ZUI.camera.projectDistance(viewObject.attributes.height);
		viewObject.attributes.screenRadius = ZUI.camera.projectDistance(viewObject.attributes.radius);
		viewObject.screenX = point.x;
		viewObject.screenY = point.y;
		viewObject.screenWidth = ZUI.camera.projectDistance(viewObject.attributes.width);
		viewObject.screenHeight = ZUI.camera.projectDistance(viewObject.attributes.height);
		viewObject.screenRadius = ZUI.camera.projectDistance(viewObject.attributes.radius);
		ZUI.processing.rect(viewObject.attributes.screenX, viewObject.attributes.screenY, viewObject.attributes.screenWidth, viewObject.attributes.screenHeight, viewObject.attributes.screenRadius);
	}
	else if (viewObject.type == ZUI.ViewObject.Type.CIRCLE) {
	}
	else if (viewObject.type == ZUI.ViewObject.Type.ELLIPSE) {
	}
	else if (viewObject.type == ZUI.ViewObject.Type.TRIANGLE) {
	}
	else if (viewObject.type == ZUI.ViewObject.Type.QUAD) {
	}
	else if (viewObject.type == ZUI.ViewObject.Type.POLYGON) {
	}
	else if (viewObject.type == ZUI.ViewObject.Type.SHAPE) {
		var point = ZUI.camera.projectPoint(viewObject.x, viewObject.y);
		viewObject.screenX = point.x;
		viewObject.screenY = point.y;
		viewObject.screenXOffset = ZUI.camera.projectDistance(viewObject.xOffset);
		viewObject.screenYOffset = ZUI.camera.projectDistance(viewObject.yOffset);
		viewObject.screenWidth = ZUI.camera.projectDistance(viewObject.width);
		viewObject.screenHeight = ZUI.camera.projectDistance(viewObject.height);
		ZUI.processing.shape(viewObject.shape, viewObject.screenX + viewObject.screenXOffset, viewObject.screenY + viewObject.screenYOffset, viewObject.screenWidth, viewObject.screenHeight);
	}
};

/* Execute an animation while pausing normal drawing routine */
ZUI.animate = function(animation) {
	this.animation = animation;
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
	var parts = number.toString().split(".");
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
		/* Clear background */
		processing.background(processing.color(ZUI.background.red, ZUI.background.green, ZUI.background.blue, ZUI.background.alpha));

		if (ZUI.animation == null) {	//No animation
			/* View should be changed */
			if (ZUI.isChangeView) {
				ZUI.activeView.inactive();
				ZUI.activeView = ZUI.newView;
				ZUI.isChangeView = false;
				ZUI.activeView.active();
				ZUI.animation = ZUI.enterNewViewAnimation;
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
	ZUI.animation = ZUI.exitOldViewAnimation;
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
};

/* Callback for mouse move event */
ZUI.mouseMove = function(event) {
	var mousePosition = ZUI.getMousePosition(event);
	ZUI.mouseStatus.xLast = ZUI.mouseStatus.x;
	ZUI.mouseStatus.yLast = ZUI.mouseStatus.y;
	ZUI.mouseStatus.x = mousePosition.x;
	ZUI.mouseStatus.y = mousePosition.y;
	ZUI.activeView.mouseMove();
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
};

/* Callback for double click event */
ZUI.doubleClick = function(event) {
	if (event.button == 0) {
		ZUI.activeView.leftDoubleClick();
	}
	else if (event.button == 1) {
		ZUI.activeView.middleDoubleClick();
	}
};

ZUI.mouseWheel = function(event) {
	event.preventDefault();
	var scroll = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
	ZUI.activeView.mouseWheel(scroll);
};

/* Gets mouse position in screen coordinates */
ZUI.getMousePosition = function(event) {
	var canvasBoundingRect = ZUI.canvas.getBoundingClientRect();
	return {
		x: event.clientX - canvasBoundingRect.left,
		y: event.clientY - canvasBoundingRect.top
	};
};

/* Callback for context menu event */
ZUI.contextMenu = function(event) {
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
	ZUI.View.prototype.animateEntry = function(mode, frame) {};	//return frameRemainder (Number)
	ZUI.View.prototype.animateExit = function(mode, frame) {};	//return frameRemainder (Number)
	ZUI.View.prototype.getLoadProgress = function() {};		//return Number between 0 and 1, inclusive

/* View object class */
ZUI.ViewObject = function(type, attributes) {
	/* Type of view object, should be one of the definitions in ZUI.ViewObject.Type */
	this.type = type;

	/* Attributes of view object */
	this.attributes = attributes;
};

	/* View object types */
	ZUI.ViewObject.Type = {
		POINT: 0,
		LINE: 1,
		RECT: 2,
		ROUNDED_RECT: 3,
		CIRCLE: 4,
		ELLIPSE: 5,
		TRIANGLE: 6,
		QUAD: 7,
		POLYGON: 8,
		SHAPE: 9,
	};
