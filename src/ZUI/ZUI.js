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

/* Variables */
ZUI.container = null;		// Container div element
ZUI.canvas = null;			// Canvas element
ZUI.context = null;			// Canvas 2D context
ZUI.frameRate = 60;			// Frame rate
ZUI.lastTimestamp = 0;		// Last timestamp taken
ZUI.width = 900;			// Canvas width
ZUI.height = 600;			// Canvas height
ZUI.activeView = null;		// Active view
ZUI.mouseStatus = {			// Mouse status
	x : 0,
	y : 0,
	xLast : 0,
	yLast : 0,
	leftDown : false,
	middleDown : false,
	rightDown : false,
};
ZUI.appStatus = {			// Application status
	start: 0,
	progress: 0,
};
ZUI.background = {			// Background color
	red : 255,
	green : 255,
	blue : 255,
	alpha : 0
};

/* Initialize */
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
	ZUI.frameRate = (settings.frameRate === undefined) ? 60 : settings.frameRate;

	/* Set camera move rate */
	ZUI.camera.moveRate = (settings.cameraMoveRate === undefined) ? 1 : settings.cameraMoveRate;

	/* Add listeneres for input events */
	ZUI.canvas.addEventListener("mousedown", ZUI.mouseDown, false);
	document.addEventListener("mouseup", ZUI.mouseUp, false);
	ZUI.canvas.addEventListener("mousemove", ZUI.mouseMove, false);
	ZUI.canvas.addEventListener("click", ZUI.click, false);
	ZUI.canvas.addEventListener("dblclick", ZUI.doubleClick, false);
	ZUI.canvas.addEventListener("mousewheel", ZUI.mouseWheel, false);
	ZUI.canvas.addEventListener("DOMMouseScroll", ZUI.mouseWheel, false);
	ZUI.canvas.addEventListener("contextmenu", ZUI.contextMenu, false);

	/* Set first view */
	ZUI.activeView = new ZUI.View();

	/* Activate first view */
	ZUI.activeView.active();

	/* Begin draw loop */
	requestAnimationFrame(ZUI.draw);
};

/* Draw */
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
		if (ZUI.activeView.animation) {
			ZUI.activeView.animation.draw();
		}
		else {
			ZUI.activeView.draw();
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

ZUI.changeActiveView = function(view) {
	ZUI.activeView.inactive();
	ZUI.activeView = view;
	ZUI.activeView.active();
};

/* Update application at every frame, override with custom function */
ZUI.update = function() {};

/* Mouse down event callback */
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

/* Mouse up event callback */
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

/* Mouse move event callback */
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

/* Click event callback */
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

/* Double click event callback */
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

/* Mouse wheel event callback */
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

/* Context menu event callback */
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

/* Function for passing input events to another element, override with custom function if needed */
ZUI.passInputEvent = null;



