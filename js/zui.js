/**
 * 2D Zooming User Interface (ZUI) Framework
 * By Hans Yu
 */

/* Define requestAnimationFrame for draw loop */
(function() {
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
					window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
})();

/* ZUI namespace */
var ZUI = {};

/* Div container */
ZUI.container = null;

/* Canvas */
ZUI.canvas = null;

/* Context handle */
ZUI.context = null;

/* Frame rate */
ZUI.frameRate = 60;
ZUI.lastTimestamp = 0;

/* Interface width */
ZUI.width = 900;

/* Interface height */
ZUI.height = 600;

/* Animation object */
ZUI.animation = null;

/* Whether view is to be changed */
ZUI.isChangeView = false;

/* Whether view changes are animated */
ZUI.isAnimateChangeView = true;

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

/* App status */
ZUI.appStatus = {
	start: 0,
	progress: 0,
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

	/* Auto-update option */
	ZUI.camera.autoUpdate = false;

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

/* Execute an animation while pausing normal drawing routine */
ZUI.animate = function(animation) {
	ZUI.animation = animation;
	if (ZUI.animation != null) {
		ZUI.animation.reset();
		ZUI.animation.begin();
	}
};

/* Converts a number to a string with comma separators */
ZUI.getNumberWithComma = function(number) {
	/* By mikez302, http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript */
	var parts = (number + "").split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts.join(".");
};

/* Checks whether two lines intersect */
ZUI.testRayLineIntersect = function(x1, y1, s1, x21, y21, x22, y22) {
	/* Test vertical */
	if (x22 == x21) {
		if (x1 > x21) return 0;
		var y = s1 * (x21 - x1) + y1;
		if (y >= y21 && y <= y22 || y >= y22 && y <= y21) return 1;
		return 0;
	}

	/* Test parallel */
	var s2 = (y22 - y21) / (x22 - x21);
	if (s1 == s2) {
		/* Test overlap */
		if (s1 * x1 + y1 == x21 * s2 + y21) {
			if (x1 >= x21 && x1 <= x22 || x1 >= x22 && x1 <= x21) return 2;
		}
		return 0;
	}

	/* Test intersect */
	var x = ((x1 * s1 - y1) - (x21 * s2 - y21)) / (s1 - s2);
	if (x >= x1 && (x >= x21 && x <= x22 || x >= x22 && x <= x21)) return 1;
	return 0;
};

/* Converts canvas to an image displayed in a new window */
ZUI.toImageInWindow = function() {
	window.open(ZUI.canvas.toDataURL());
};

/* Initialization */
ZUI.initialize = function(settings) {
	/* Set canvas and container handles */
	if (settings.canvas) {
		ZUI.canvas = settings.canvas;
		ZUI.context = ZUI.canvas.getContext("2d");
		ZUI.container = ZUI.canvas.parentNode;
	}
	else {
		//TODO
	}

	/* Disable default context menu */
	ZUI.container.oncontextmenu = function() {
		return false;
	};

	/* Set width and height */
	if (settings.width && settings.height) {
		ZUI.width = settings.width;
		ZUI.height = settings.height;
		$(ZUI.canvas).width(ZUI.width);
		$(ZUI.canvas).height(ZUI.height);
	}
	else {
		ZUI.width = $(ZUI.canvas).width();
		ZUI.height = $(ZUI.canvas).height();
	}

	/* Set background */
	ZUI.background = (settings.background === undefined) ? "#ffffff" : settings.background;
	ZUI.backgroundAlpha = (settings.backgroundAlpha === undefined) ? 1 : settings.backgroundAlpha;

	/* Set frame rate */
	if (settings.frameRate) {
		ZUI.frameRate = settings.frameRate;
	}
	else {
		ZUI.frameRate = 60;
	}

	/* Add listeneres for input events */
	ZUI.canvas.addEventListener("mousedown", ZUI.mouseDown, false);
	document.addEventListener("mouseup", ZUI.mouseUp, false);
	ZUI.canvas.addEventListener("mousemove", ZUI.mouseMove, false);
	ZUI.canvas.addEventListener("click", ZUI.click, false);
	ZUI.canvas.addEventListener("dblclick", ZUI.doubleClick, false);
	ZUI.canvas.addEventListener("mousewheel", ZUI.mouseWheel, false);
	ZUI.canvas.addEventListener("contextmenu", ZUI.contextMenu, false);

	/* Set first view */
	ZUI.activeView = new ZUI.View();

	/* Activate first view */
	ZUI.activeView.active();

	/* Begin draw loop */
	requestAnimationFrame(ZUI.draw);
};

/* Gets called every frame */
ZUI.draw = function(timestamp) {
	/* Request next frame */
	requestAnimationFrame(ZUI.draw);
	
	if (timestamp - ZUI.lastTimestamp > 1000 / ZUI.frameRate) {
		/* Update lastTimestamp */
		ZUI.lastTimestamp = timestamp - ((timestamp - ZUI.lastTimestamp) % 1000 / ZUI.frameRate);
		
		/* Update app status */
		if (ZUI.appStatus.start == null) {
			ZUI.appStatus.start = timestamp;
		}
		ZUI.appStatus.progress = timestamp - ZUI.appStatus.start;
	
		/* Call update function */
		ZUI.update();

		/* Update camera */
		if (ZUI.camera.autoUpdate) {
			ZUI.camera.update();
		}
	
		/* Clear canvas */
		ZUI.context.clearRect(0, 0, ZUI.width, ZUI.height);
		ZUI.context.save();
		ZUI.context.globalAlpha = ZUI.backgroundAlpha;
		ZUI.context.strokeStyle = ZUI.background;
		ZUI.context.fillStyle = ZUI.background;
		ZUI.context.fillRect(0, 0, ZUI.width, ZUI.height)
		ZUI.context.restore();

		/* Auto-draw */
		var viewObjects = ZUI.activeView.viewObjects;
		for (var n = 0; n < viewObjects.length; n++) {
			if (viewObjects[n].autoDraw) {
				viewObjects[n].draw();
			}
		}

		/* Draw */
		if (ZUI.animation == null) {
			if (ZUI.isChangeView) {
				ZUI.activeView.inactive();
				ZUI.activeView = ZUI.newView;
				ZUI.isChangeView = false;
				ZUI.oldView = null;
				ZUI.newView = null;
				ZUI.activeView.active();
				ZUI.animate(ZUI.enterNewViewAnimation);
			}
			else {
				ZUI.activeView.draw();
			}
		}
		else {
			if (!ZUI.animation.isOver()) {
				ZUI.animation.next();
			}
			else {
				if (ZUI.animation.end) {
					ZUI.animation.end();
				}
				ZUI.animation = null;
			}
		}

		/* Check for mouse over/out events */
		var x = ZUI.mouseStatus.x;
		var y = ZUI.mouseStatus.y;
		var viewObjects = ZUI.activeView.viewObjects;
		var viewObject = null;
		for (var n = 0; n < viewObjects.length; n++) {
			if (viewObjects[n].isInBound(x, y)) {
				viewObject = viewObjects[n];
			}
			else if (viewObjects[n].isHovered) {
				viewObjects[n].isHovered = false;
				viewObjects[n].mouseOut();
			}
		}
		if (viewObject) {
			if (!viewObject.isHovered) {
				viewObject.isHovered = true;
				viewObject.mouseOver();
			}
		}
	}
};

/* Change active view */
ZUI.changeActiveView = function(view, exitAnimation, entryAnimation) {
	ZUI.oldView = ZUI.activeView;
	ZUI.newView = view;
	if (!ZUI.isAnimateChangeView) {
		exitAnimation = null;
		entryAnimation = null;
	}
	ZUI.exitOldViewAnimation = exitAnimation;
	ZUI.enterNewViewAnimation = entryAnimation;
	ZUI.isChangeView = true;
	ZUI.animate(ZUI.exitOldViewAnimation);
};

/* Called every frame regardless of view, override with custom function */
ZUI.update = function() {};

/* Callback for mouse down event */
ZUI.mouseDown = function(event) {
	var x = ZUI.mouseStatus.x;
	var y = ZUI.mouseStatus.y;
	var viewObjects = ZUI.activeView.viewObjects;
	var viewObject = null;
	for (var n = viewObjects.length - 1; n >= 0; n--) {
		if (viewObjects[n].isInBound(x, y)) {
			viewObject = viewObjects[n];
			break;
		}
	}
	
	if (event.button == 0) {
		ZUI.mouseStatus.leftDown = true;
		ZUI.activeView.leftMouseDown();
		if (viewObject) viewObject.leftMouseDown();
	}
	else if (event.button == 1) {
		ZUI.mouseStatus.middleDown = true;
		ZUI.activeView.middleMouseDown();
		if (viewObject) viewObject.middleMouseDown();
	}
	else if (event.button == 2) {
		ZUI.mouseStatus.rightDown = true;
		ZUI.activeView.rightMouseDown();
		if (viewObject) viewObject.rightMouseDown();
	}
	if (ZUI.passInputEvent != null) {
		ZUI.passInputEvent(event);
	}
};

/* Callback for mouse up event */
ZUI.mouseUp = function(event) {
	var x = ZUI.mouseStatus.x;
	var y = ZUI.mouseStatus.y;
	var viewObjects = ZUI.activeView.viewObjects;
	var viewObject = null;
	for (var n = viewObjects.length - 1; n >= 0; n--) {
		if (viewObjects[n].isInBound(x, y)) {
			viewObject = viewObjects[n];
			break;
		}
	}
	
	if (event.button == 0) {
		ZUI.mouseStatus.leftDown = false;
		ZUI.activeView.leftMouseUp();
		if (viewObject) viewObject.leftMouseUp();
	}
	else if (event.button == 1) {
		ZUI.mouseStatus.middleDown = false;
		ZUI.activeView.middleMouseUp();
		if (viewObject) viewObject.middleMouseUp();
	}
	else if (event.button == 2) {
		ZUI.mouseStatus.rightDown = false;
		ZUI.activeView.rightMouseUp();
		if (viewObject) viewObject.rightMouseUp();
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

	var x = ZUI.mouseStatus.x;
	var y = ZUI.mouseStatus.y;
	var viewObjects = ZUI.activeView.viewObjects;
	var viewObject = null;
	for (var n = 0; n < viewObjects.length; n++) {
		if (viewObjects[n].isInBound(x, y)) {
			viewObject = viewObjects[n];
		}
		else if (viewObjects[n].isHovered) {
			viewObjects[n].isHovered = false;
			viewObjects[n].mouseOut();
		}
	}

	ZUI.activeView.mouseMove();
	if (viewObject) {
		viewObject.mouseMove();
		if (!viewObject.isHovered) {
			viewObject.isHovered = true;
			viewObject.mouseOver();
		}
	}
	
	if (ZUI.passInputEvent != null) {
		ZUI.passInputEvent(event);
	}
};

/* Callback for click event */
ZUI.click = function(event) {
	var x = ZUI.mouseStatus.x;
	var y = ZUI.mouseStatus.y;
	var viewObjects = ZUI.activeView.viewObjects;
	var viewObject = null;
	for (var n = viewObjects.length - 1; n >= 0; n--) {
		if (viewObjects[n].isInBound(x, y)) {
			viewObject = viewObjects[n];
			break;
		}
	}
	
	if (event.button == 0) {
		ZUI.activeView.leftClick();
		if (viewObject) viewObject.leftClick();
	}
	else if (event.button == 1) {
		ZUI.activeView.middleClick();
		if (viewObject) viewObject.middleClick();
	}
	else if (event.button == 2) {
		ZUI.activeView.rightClick();
		if (viewObject) viewObject.rightClick();
	}
	if (ZUI.passInputEvent != null) {
		ZUI.passInputEvent(event);
	}
};

/* Callback for double click event */
ZUI.doubleClick = function(event) {
	var x = ZUI.mouseStatus.x;
	var y = ZUI.mouseStatus.y;
	var viewObjects = ZUI.activeView.viewObjects;
	var viewObject = null;
	for (var n = viewObjects.length - 1; n >= 0; n--) {
		if (viewObjects[n].isInBound(x, y)) {
			viewObject = viewObjects[n];
			break;
		}
	}
	
	if (event.button == 0) {
		ZUI.activeView.leftDoubleClick();
		if (viewObject) viewObject.leftDoubleClick();
	}
	else if (event.button == 1) {
		ZUI.activeView.middleDoubleClick();
		if (viewObject) viewObject.middleDoubleClick();
	}
	if (ZUI.passInputEvent != null) {
		ZUI.passInputEvent(event);
	}
};

ZUI.mouseWheel = function(event) {
	event.preventDefault();
	var scroll = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
	
	var x = ZUI.mouseStatus.x;
	var y = ZUI.mouseStatus.y;
	var viewObjects = ZUI.activeView.viewObjects;
	var viewObject = null;
	for (var n = viewObjects.length - 1; n >= 0; n--) {
		if (viewObjects[n].isInBound(x, y)) {
			viewObject = viewObjects[n];
			break;
		}
	}
	
	ZUI.activeView.mouseWheel(scroll);
	if (viewObject) viewObject.mouseWheel(scroll);
	if (ZUI.passInputEvent != null) {
		ZUI.passInputEvent(event);
	}
};

/* Callback for context menu event */
ZUI.contextMenu = function(event) {
	var x = ZUI.mouseStatus.x;
	var y = ZUI.mouseStatus.y;
	var viewObjects = ZUI.activeView.viewObjects;
	var viewObject = null;
	for (var n = viewObjects.length - 1; n >= 0; n--) {
		if (viewObjects[n].isInBound(x, y)) {
			viewObject = viewObjects[n];
			break;
		}
	}
	
	ZUI.activeView.contextMenu();
	if (viewObject) viewObject.contextMenu();
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
ZUI.Animation = function(frames, drawFrame, begin, end) {
	this.frames = frames;
	this.drawFrame = drawFrame || function(currentFrame){};
	this.begin = begin || function(){};
	this.end = end || function(){};
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
ZUI.View = function() {
	this.viewObjects = [];
};

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
	ZUI.View.prototype.contextMenu = function() {};
	ZUI.View.prototype.getLoadProgress = function() {};		//return Number between 0 and 1, inclusive

/* View object class */
ZUI.ViewObject = function(attributes) {
	/* Set shape and its attributes */
	if (!attributes.shape) return null;
	this.shape = attributes.shape;
	this.x = (attributes.x === undefined) ? 0 : attributes.x;
	this.y = (attributes.y === undefined) ? 0 : attributes.y;
	if (this.shape == "rect") {
		this.offsetX = (attributes.offsetX === undefined) ? 0 : attributes.offsetX;
		this.offsetY = (attributes.offsetY === undefined) ? 0 : attributes.offsetY;
		this.width = (attributes.width === undefined) ? 0 : attributes.width;
		this.height = (attributes.height === undefined) ? 0 : attributes.height;
		if (attributes.radius === undefined) {
			this.ltradius = (attributes.ltradius === undefined) ? 0 : attributes.ltradius;
			this.rtradius = (attributes.rtradius === undefined) ? 0 : attributes.rtradius;
			this.lbradius = (attributes.lbradius === undefined) ? 0 : attributes.lbradius;
			this.rbradius = (attributes.rbradius === undefined) ? 0 : attributes.rbradius;
		}
		else {
			this.ltradius = attributes.radius;
			this.rtradius = attributes.radius;
			this.lbradius = attributes.radius;
			this.rbradius = attributes.radius;
		}
		this.centerAt = (attributes.centerAt === undefined) ? "center center" : attributes.centerAt;
	}
	else if (this.shape == "circle") {
		this.offsetX = (attributes.offsetX === undefined) ? 0 : attributes.offsetX;
		this.offsetY = (attributes.offsetY === undefined) ? 0 : attributes.offsetY;
		if (attributes.radius === undefined) {
			this.hradius = (attributes.hradius === undefined) ? 0 : attributes.hradius;
			this.vradius = (attributes.vradius === undefined) ? 0 : attributes.vradius;
		}
		else {
			this.hradius = attributes.radius;
			this.vradius = attributes.radius;
		}
		this.centerAt = (attributes.centerAt === undefined) ? "center center" : attributes.centerAt;
	}
	else if (this.shape == "polygon") {
		this.vertices = (attributes.vertices === undefined) ? [] : attributes.vertices;
	}
	else if (this.shape == "path") {
		this.vertices = (attributes.vertices === undefined) ? "" : attributes.vertices;
	}
	else if (this.shape == "text") {
		this.offsetX = (attributes.offsetX === undefined) ? 0 : attributes.offsetX;
		this.offsetY = (attributes.offsetY === undefined) ? 0 : attributes.offsetY;
		this.size = (attributes.size === undefined) ? 12 : attributes.size;
		this.font = (attributes.font === undefined) ? "Helvetica" : attributes.font;
		this.centerAt = (attributes.centerAt === undefined) ? "center center" : attributes.centerAt;
		this.content = (attributes.content === undefined) ? "" : attributes.content;
		ZUI.context.save();
		ZUI.context.font = this.size + "px " + this.font;
		this.width = ZUI.context.measureText(this.content).width;
		this.height = this.size * 0.8;
		ZUI.context.restore();
	}
	else if (this.shape == "svg") {
		this.offsetX = (attributes.offsetX === undefined) ? 0 : attributes.offsetX;
		this.offsetY = (attributes.offsetY === undefined) ? 0 : attributes.offsetY;
		this.hscale = (attributes.hscale === undefined) ? 1 : attributes.hscale;
		this.vscale = (attributes.vscale === undefined) ? 1 : attributes.vscale;
		this.centerAt = (attributes.centerAt === undefined) ? "center center" : attributes.centerAt;
		this.url = (attributes.url === undefined) ? "" : attributes.url;
		this.ready = false;
		$.ajax({
			type: "GET",
			url: this.url,
			dataType: "text"
		}).done($.proxy(function(response) {
			this.image = new Image();
			var DOMURL = self.URL || self.webkitURL || self;
			var svg = new Blob([response], {type: "image/svg+xml;charset=utf-8"});
			var url = DOMURL.createObjectURL(svg);
			this.image.onload = $.proxy(function() {
				this.ready = true;
				this.width = this.image.width;
				this.height = this.image.height;
			}, this);
			this.image.src = url;
		}, this));
	}
	else return null;

	/* Set stroke and fill */
	this.stroke = (attributes.stroke === undefined) ? true : attributes.stroke;
	this.strokeColor = (attributes.strokeColor === undefined) ? "#000000" : attributes.strokeColor;
	this.strokeWidth = (attributes.strokeWidth === undefined) ? 1 : attributes.strokeWidth;
	this.fill = (attributes.fill === undefined) ? true : attributes.fill;
	this.fillColor = (attributes.fillColor === undefined) ? "#000000" : attributes.fillColor;
	this.alpha = (attributes.alpha === undefined) ? 1 : attributes.alpha;

	/* Set scale */
	this.positionScale = (attributes.positionScale === undefined) ? "world" : attributes.positionScale;
	this.sizeScale = (attributes.sizeScale === undefined) ? "world" : attributes.sizeScale;

	/* Set autoDraw option */
	this.autoDraw = (attributes.autoDraw === undefined) ? false : attributes.autoDraw;
	
	/* Initialize hover state */
	this.isHovered = false;

	/* On screen status */
	this.isOnScreen = false;
	
	/* Define event handlers */
	this.leftMouseDown = (attributes.leftMouseDown === undefined) ? function() {} : attributes.leftMouseDown;
	this.middleMouseDown = (attributes.middleMouseDown === undefined) ? function() {} : attributes.middleMouseDown;
	this.rightMouseDown = (attributes.rightMouseDown === undefined) ? function() {} : attributes.rightMouseDown;
	this.leftMouseUp = (attributes.leftMouseUp === undefined) ? function() {} : attributes.leftMouseUp;
	this.middleMouseUp = (attributes.middleMouseUp === undefined) ? function() {} : attributes.middleMouseUp;
	this.rightMouseUp = (attributes.rightMouseUp === undefined) ? function() {} : attributes.rightMouseUp;
	this.mouseMove = (attributes.mouseMove === undefined) ? function() {} : attributes.mouseMove;
	this.leftClick = (attributes.leftClick === undefined) ? function() {} : attributes.leftClick;
	this.middleClick = (attributes.middleClick === undefined) ? function() {} : attributes.middleClick;
	this.rightClick = (attributes.rightClick === undefined) ? function() {} : attributes.rightClick;
	this.leftDoubleClick = (attributes.leftDoubleClick === undefined) ? function() {} : attributes.leftDoubleClick;
	this.middleDoubleClick = (attributes.middleDoubleClick === undefined) ? function() {} : attributes.middleDoubleClick;
	this.mouseWheel = (attributes.mouseWheel === undefined) ? function() {} : attributes.mouseWheel;
	this.contextMenu = (attributes.contextMenu === undefined) ? function() {} : attributes.contextMenu;
	this.mouseOver = (attributes.mouseOver === undefined) ? function() {} : attributes.mouseOver;
	this.mouseOut = (attributes.mouseOut === undefined) ? function() {} : attributes.mouseOut;
};

	ZUI.ViewObject.prototype.draw = function() {
		if (this.shape == "rect") {
			if (this.positionScale == "world") {
				var position = ZUI.camera.projectPoint(this.x, this.y);
				this.screenX = position.x;
				this.screenY = position.y;
			}
			else if (this.positionScale == "screen") {
				this.screenX = this.x;
				this.screenY = this.y;
			}
			if (this.sizeScale == "world") {
				this.screenOffsetX = ZUI.camera.projectDistance(this.offsetX);
				this.screenOffsetY = ZUI.camera.projectDistance(this.offsetY);
				this.screenWidth = ZUI.camera.projectDistance(this.width);
				this.screenHeight = ZUI.camera.projectDistance(this.height);
				this.screenLtradius = ZUI.camera.projectDistance(this.ltradius);
				this.screenRtradius = ZUI.camera.projectDistance(this.rtradius);
				this.screenLbradius = ZUI.camera.projectDistance(this.lbradius);
				this.screenRbradius = ZUI.camera.projectDistance(this.rbradius);
			}
			else if (this.sizeScale == "screen") {
				this.screenOffsetX = this.offsetX;
				this.screenOffsetY = this.offsetY;
				this.screenWidth = this.width;
				this.screenHeight = this.height;
				this.screenLtradius = this.ltradius;
				this.screenRtradius = this.rtradius;
				this.screenLbradius = this.lbradius;
				this.screenRbradius = this.rbradius;
			}
			if (this.screenLtradius > this.screenWidth / 2) this.screenLtradius = this.screenWidth / 2;
			if (this.screenLtradius > this.screenHeight / 2) this.screenLtradius = this.screenHeight / 2;
			if (this.screenRtradius > this.screenWidth / 2) this.screenRtradius = this.screenWidth / 2;
			if (this.screenRtradius > this.screenHeight / 2) this.screenRtradius = this.screenHeight / 2;
			if (this.screenLbradius > this.screenWidth / 2) this.screenLbradius = this.screenWidth / 2;
			if (this.screenLbradius > this.screenHeight / 2) this.screenLbradius = this.screenHeight / 2;
			if (this.screenRbradius > this.screenWidth / 2) this.screenRbradius = this.screenWidth / 2;
			if (this.screenRbradius > this.screenHeight / 2) this.screenRbradius = this.screenHeight / 2;
			ZUI.context.save();
			ZUI.context.strokeStyle = this.strokeColor;
			ZUI.context.lineWidth = this.strokeWidth;
			ZUI.context.fillStyle = this.fillColor;
			ZUI.context.globalAlpha = this.alpha;
			var screenX, screenY;
			var centerAt = this.centerAt.split(" ");
			if (centerAt[0] == "left") {
				screenX = 0;
			}
			else if (centerAt[0] == "center") {
				screenX = -this.screenWidth / 2;
			}
			else if (centerAt[0] == "right") {
				screenX = -this.screenWidth;
			}
			screenX += this.screenX + this.screenOffsetX;
			if (centerAt[1] == "top") {
				screenY = 0;
			}
			else if (centerAt[1] == "center") {
				screenY = -this.screenHeight / 2;
			}
			else if (centerAt[1] == "bottom") {
				screenY = -this.screenHeight;
			}
			screenY += this.screenY + this.screenOffsetY;
			ZUI.context.beginPath();
			ZUI.context.moveTo(screenX + this.screenLtradius, screenY);
			ZUI.context.arcTo(screenX + this.screenWidth, screenY, screenX + this.screenWidth, screenY + this.screenHeight, this.screenRtradius);
			ZUI.context.arcTo(screenX + this.screenWidth, screenY + this.screenHeight, screenX, screenY + this.screenHeight, this.screenRbradius);
			ZUI.context.arcTo(screenX, screenY + this.screenHeight, screenX, screenY, this.screenLbradius);
			ZUI.context.arcTo(screenX, screenY, screenX + this.screenWidth, screenY, this.screenLtradius);
			ZUI.context.closePath();
			if (this.stroke) {
				ZUI.context.stroke();
			}
			if (this.fill) {
				ZUI.context.fill();
			}
			ZUI.context.restore();
			this.isOnScreen = true;
		}
		else if (this.shape == "circle") {
			if (this.positionScale == "world") {
				var position = ZUI.camera.projectPoint(this.x, this.y);
				this.screenX = position.x;
				this.screenY = position.y;
			}
			else if (this.positionScale == "screen") {
				this.screenX = this.x;
				this.screenY = this.y;
			}
			if (this.sizeScale == "world") {
				this.screenOffsetX = ZUI.camera.projectDistance(this.offsetX);
				this.screenOffsetY = ZUI.camera.projectDistance(this.offsetY);
				this.screenHradius = ZUI.camera.projectDistance(this.hradius);
				this.screenVradius = ZUI.camera.projectDistance(this.vradius);
			}
			else if (this.sizeScale == "screen") {
				this.screenOffsetX = this.offsetX;
				this.screenOffsetY = this.offsetY;
				this.screenHradius = this.hradius;
				this.screenVradius = this.vradius;
			}
			ZUI.context.save();
			ZUI.context.strokeStyle = this.strokeColor;
			ZUI.context.lineWidth = this.strokeWidth;
			ZUI.context.fillStyle = this.fillColor;
			ZUI.context.globalAlpha = this.alpha;
			var screenX, screenY;
			var centerAt = this.centerAt.split(" ");
			if (centerAt[0] == "left") {
				screenX = this.screenHradius / 2;
			}
			else if (centerAt[0] == "center") {
				screenX = 0;
			}
			else if (centerAt[0] == "right") {
				screenX = -this.screenHradius / 2;
			}
			screenX += this.screenX + this.screenOffsetX;
			if (centerAt[1] == "top") {
				screenY = this.screenVradius / 2;
			}
			else if (centerAt[1] == "center") {
				screenY = 0;
			}
			else if (centerAt[1] == "bottom") {
				screenY = -this.screenVradius / 2;
			}
			screenY += this.screenY + this.screenOffsetY;
			ZUI.context.save();
			ZUI.context.translate(screenX, screenY);
			ZUI.context.scale(this.screenHradius, this.screenVradius);
			ZUI.context.beginPath();
			ZUI.context.arc(0, 0, 1, 0, 2 * Math.PI);
			ZUI.context.closePath();
			ZUI.context.restore();
			if (this.stroke) {
				ZUI.context.stroke();
			}
			if (this.fill) {
				ZUI.context.fill();
			}
			ZUI.context.restore();
			this.isOnScreen = true;
		}
		else if (this.shape == "polygon") {
			if (this.positionScale == "world") {
				var position = ZUI.camera.projectPoint(this.x, this.y);
				this.screenX = position.x;
				this.screenY = position.y;
			}
			else if (this.positionScale == "screen") {
				this.screenX = this.x;
				this.screenY = this.y;
			}
			if (this.sizeScale == "world") {
				this.screenVertices = [];
				for (var n = 0; n < this.vertices.length; n++) {
					this.screenVertices.push({
						x: ZUI.camera.projectDistance(this.vertices[n].x),
						y: ZUI.camera.projectDistance(this.vertices[n].y)
					});
				}
			}
			else if (this.sizeScale == "screen") {
				this.screenVertices = [];
				for (var n = 0; n < this.vertices.length; n++) {
					this.screenVertices.push({
						x: this.vertices[n].x,
						y: this.vertices[n].y
					});
				}
			}

			ZUI.context.save();
			ZUI.context.strokeStyle = this.strokeColor;
			ZUI.context.lineWidth = this.strokeWidth;
			ZUI.context.fillStyle = this.fillColor;
			ZUI.context.globalAlpha = this.alpha;
			ZUI.context.translate(this.screenX, this.screenY);
			ZUI.context.beginPath();
			ZUI.context.moveTo(this.screenVertices[this.screenVertices.length - 1].x, this.screenVertices[this.screenVertices.length - 1].y);
			for (var n = 0; n < this.screenVertices.length; n++) {
				ZUI.context.lineTo(this.screenVertices[n].x, this.screenVertices[n].y);
			}
			ZUI.context.closePath();
			if (this.stroke) {
				ZUI.context.stroke();
			}
			if (this.fill) {
				ZUI.context.fill();
			}
			ZUI.context.restore();
			this.isOnScreen = true;
		}
		else if (this.shape == "path") {
			if (this.positionScale == "world") {
				var position = ZUI.camera.projectPoint(this.x, this.y);
				this.screenX = position.x;
				this.screenY = position.y;
			}
			else if (this.positionScale == "screen") {
				this.screenX = this.x;
				this.screenY = this.y;
			}
			if (this.sizeScale == "world") {
				this.screenVertices = [];
				for (var n = 0; n < this.vertices.length; n++) {
					this.screenVertices.push({
						x: ZUI.camera.projectDistance(this.vertices[n].x),
						y: ZUI.camera.projectDistance(this.vertices[n].y)
					});
				}
			}
			else if (this.sizeScale == "screen") {
				this.screenVertices = [];
				for (var n = 0; n < this.vertices.length; n++) {
					this.screenVertices.push({
						x: this.vertices[n].x,
						y: this.vertices[n].y
					});
				}
			}

			ZUI.context.save();
			ZUI.context.strokeStyle = this.strokeColor;
			ZUI.context.lineWidth = this.strokeWidth;
			ZUI.context.globalAlpha = this.alpha;
			ZUI.context.translate(this.screenX, this.screenY);
			ZUI.context.beginPath();
			ZUI.context.moveTo(this.screenVertices[0].x, this.screenVertices[0].y);
			for (var n = 1; n < this.screenVertices.length; n++) {
				ZUI.context.lineTo(this.screenVertices[n].x, this.screenVertices[n].y);
			}
			if (this.stroke) {
				ZUI.context.stroke();
			}
			ZUI.context.closePath();
			ZUI.context.restore();
			this.isOnScreen = true;
		}
		else if (this.shape == "text") {
			if (this.positionScale == "world") {
				var position = ZUI.camera.projectPoint(this.x, this.y);
				this.screenX = position.x;
				this.screenY = position.y;
			}
			else if (this.positionScale == "screen") {
				this.screenX = this.x;
				this.screenY = this.y;
			}
			if (this.sizeScale == "world") {
				this.screenOffsetX = ZUI.camera.projectDistance(this.offsetX);
				this.screenOffsetY = ZUI.camera.projectDistance(this.offsetY);
				this.screenSize = ZUI.camera.projectDistance(this.size);
				this.screenWidth = ZUI.camera.projectDistance(this.width);
				this.screenHeight = ZUI.camera.projectDistance(this.height);
			}
			else if (this.sizeScale == "screen") {
				this.screenOffsetX = this.offsetX;
				this.screenOffsetY = this.offsetY;
				this.screenSize = this.size;
				this.screenWidth = this.width;
				this.screenHeight = this.height;
			}
			ZUI.context.save();
			ZUI.context.strokeStyle = this.strokeColor;
			ZUI.context.lineWidth = this.strokeWidth;
			ZUI.context.fillStyle = this.fillColor;
			ZUI.context.globalAlpha = this.alpha;
			ZUI.context.font = this.screenSize + "px " + this.font;
			var screenX, screenY;
			var centerAt = this.centerAt.split(" ");
			if (centerAt[0] == "left") {
				screenX = 0;
			}
			else if (centerAt[0] == "center") {
				screenX = -this.screenWidth / 2;
			}
			else if (centerAt[0] == "right") {
				screenX = -this.screenWidth;
			}
			screenX += this.screenX + this.screenOffsetX;
			if (centerAt[1] == "top") {
				screenY = 0;
			}
			else if (centerAt[1] == "center") {
				screenY = this.screenHeight / 2;
			}
			else if (centerAt[1] == "bottom") {
				screenY = this.screenHeight;
			}
			screenY += this.screenY + this.screenOffsetY;
			if (this.fill) {
				ZUI.context.fillText(this.content, screenX, screenY);
			}
			else if (this.stroke) {
				ZUI.context.strokeText(this.content, screenX, screenY);
			}
			ZUI.context.restore();
			this.isOnScreen = true;
		}
		else if (this.shape == "svg" && this.ready) {
			if (this.positionScale == "world") {
				var position = ZUI.camera.projectPoint(this.x, this.y);
				this.screenX = position.x;
				this.screenY = position.y;
			}
			else if (this.positionScale == "screen") {
				this.screenX = this.x;
				this.screenY = this.y;
			}
			if (this.sizeScale == "world") {
				this.screenOffsetX = ZUI.camera.projectDistance(this.offsetX);
				this.screenOffsetY = ZUI.camera.projectDistance(this.offsetY);
				this.screenWidth = ZUI.camera.projectDistance(this.width) * this.hscale;
				this.screenHeight = ZUI.camera.projectDistance(this.height) * this.vscale;
			}
			else if (this.sizeScale == "screen") {
				this.screenOffsetX = this.offsetX;
				this.screenOffsetY = this.offsetY;
				this.screenWidth = this.width * this.hscale;
				this.screenHeight = this.height * this.vscale;
			}
			ZUI.context.save();
			var screenX, screenY;
			var centerAt = this.centerAt.split(" ");
			if (centerAt[0] == "left") {
				screenX = 0;
			}
			else if (centerAt[0] == "center") {
				screenX =  -this.screenWidth / 2;
			}
			else if (centerAt[0] == "right") {
				screenX = -this.screenWidth;
			}
			screenX += this.screenX + this.screenOffsetX;
			if (centerAt[1] == "top") {
				screenY = 0;
			}
			else if (centerAt[1] == "center") {
				screenY = -this.screenHeight / 2;
			}
			else if (centerAt[1] == "bottom") {
				screenY = -this.screenHeight;
			}
			screenY += this.screenY + this.screenOffsetY;
			ZUI.context.translate(screenX, screenY);
			ZUI.context.scale(this.screenWidth / this.width, this.screenHeight / this.height);
			ZUI.context.drawImage(this.image, 0, 0);
			ZUI.context.restore();
			this.isOnScreen = true;
		}
	};
	
	ZUI.ViewObject.prototype.isInBound = function(x, y) {
		if (!this.isOnScreen) return false;
		if (this.shape == "rect") {
			var screenX, screenY;
			var centerAt = this.centerAt.split(" ");
			if (centerAt[0] == "left") {
				screenX = 0;
			}
			else if (centerAt[0] == "center") {
				screenX =  -this.screenWidth / 2;
			}
			else if (centerAt[0] == "right") {
				screenX = -this.screenWidth;
			}
			screenX += this.screenX + this.screenOffsetX;
			if (centerAt[1] == "top") {
				screenY = 0;
			}
			else if (centerAt[1] == "center") {
				screenY = -this.screenHeight / 2;
			}
			else if (centerAt[1] == "bottom") {
				screenY = -this.screenHeight;
			}
			screenY += this.screenY + this.screenOffsetY;
			if (x < screenX) return false;
			if (x > screenX + this.screenWidth) return false;
			if (y < screenY) return false;
			if (y > screenY + this.screenHeight) return false;
			return true;
		}
		else if (this.shape == "circle") {
			var screenX, screenY;
			var centerAt = this.centerAt.split(" ");
			if (centerAt[0] == "left") {
				screenX = this.screenHradius / 2;
			}
			else if (centerAt[0] == "center") {
				screenX = 0;
			}
			else if (centerAt[0] == "right") {
				screenX = -this.screenHradius / 2;
			}
			screenX += this.screenX + this.screenOffsetX;
			if (centerAt[1] == "top") {
				screenY = this.screenVradius / 2;
			}
			else if (centerAt[1] == "center") {
				screenY = 0;
			}
			else if (centerAt[1] == "bottom") {
				screenY = -this.screenVradius / 2;
			}
			screenY += this.screenY + this.screenOffsetY;
			if (Math.pow(x - screenX, 2) / Math.pow(this.hradius, 2) + Math.pow(y - screenY, 2) / Math.pow(this.vradius, 2) <= 1) {
				return true;
			}
			return false;
		}
		else if (this.shape == "polygon") {
			var intersectCount = 0;
			var vertex = this.screenVertices[this.screenVertices.length - 1];
			var x1 = vertex.x + this.screenX;
			var y1 = vertex.y + this.screenY;
			for (var n = 0; n < this.screenVertices.length; n++) {
				vertex = this.screenVertices[n];
				var x2 = vertex.x + this.screenX;
				var y2 = vertex.y + this.screenY;
				var result = ZUI.testRayLineIntersect(x, y, 0, x1, y1, x2, y2);
				if (result == 2) return true;
				if (result == 1) intersectCount++;
				x1 = x2;
				y1 = y2;
			}
			if (intersectCount % 2 == 1) return true;
			return false;
		}
		else if (this.shape == "text") {
			var screenX, screenY;
			var centerAt = this.centerAt.split(" ");
			if (centerAt[0] == "left") {
				screenX = 0;
			}
			else if (centerAt[0] == "center") {
				screenX = -this.screenWidth / 2;
			}
			else if (centerAt[0] == "right") {
				screenX = -this.screenWidth;
			}
			screenX += this.screenX + this.screenOffsetX;
			if (centerAt[1] == "top") {
				screenY = 0;
			}
			else if (centerAt[1] == "center") {
				screenY = -this.screenHeight / 2;
			}
			else if (centerAt[1] == "bottom") {
				screenY = -this.screenHeight;
			}
			screenY += this.screenY + this.screenOffsetY;
			if (x < screenX) return false;
			if (x > screenX + this.screenWidth) return false;
			if (y < screenY) return false;
			if (y > screenY + this.screenHeight) return false;
			return true;
		}
		else if (this.shape == "svg") {
			var screenX, screenY;
			var centerAt = this.centerAt.split(" ");
			if (centerAt[0] == "left") {
				screenX = 0;
			}
			else if (centerAt[0] == "center") {
				screenX =  -this.screenWidth / 2;
			}
			else if (centerAt[0] == "right") {
				screenX = -this.screenWidth;
			}
			screenX += this.screenX + this.screenOffsetX;
			if (centerAt[1] == "top") {
				screenY = 0;
			}
			else if (centerAt[1] == "center") {
				screenY = -this.screenHeight / 2;
			}
			else if (centerAt[1] == "bottom") {
				screenY = -this.screenHeight;
			}
			screenY += this.screenY + this.screenOffsetY;
			if (x < screenX) return false;
			if (x > screenX + this.screenWidth) return false;
			if (y < screenY) return false;
			if (y > screenY + this.screenHeight) return false;
			return true;
		}
		return false;
	};

