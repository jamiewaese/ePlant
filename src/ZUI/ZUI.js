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

/* Define String.prototype.indexOf if undefined */
(function() {
	if (!String.prototype.indexOf) {
		String.prototype.indexOf = function(obj, start) {
			for (var n = (start || 0), length = this.length; i < length; i++) {
				if (this[n] === obj) return n;
			}
		};
	}
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
ZUI.viewObjects = [];		// All view objects
ZUI.customContextMenu = null;	// Custom context menu
ZUI.mouseStatus = {			// Mouse status
	x: 0,
	y: 0,
	xLast: 0,
	yLast: 0,
	leftDown: false,
	middleDown: false,
	rightDown: false,
};
ZUI.touchStatus = {			// Touch status
	pointers: [],			// Touch pointers
	isPinch: false,		// Whether screen is being pinched with two pointers
	isRotate: false,		// Whether screen is being rotated with two fingers
	lastZoom: 0,			// Zoom at start of pinch
	lastRotation: 0		// Rotation at start of rotate
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
ZUI.eventListeners = null;		// Event listeners hash table, initialized in ZUI.initialize

/* Initialize */
ZUI.initialize = function(settings) {
	/* Initialize eventListeners */
	ZUI.eventListeners = new ZUI.HashMap();

	/* Set canvas and container handles */
	if (settings.canvas) {
		ZUI.canvas = settings.canvas;
		ZUI.context = ZUI.canvas.getContext("2d");
		ZUI.context.advArcTo = function() {
			ZUI.context.save();
			
			ZUI.context.restore();
		}
		ZUI.container = ZUI.canvas.parentNode;
	}
	else {
		//TODO
	}

	/* Disable default context menu */
	ZUI.canvas.oncontextmenu = function(event) {
		ZUI.contextMenu(event);
		return false;
	};

	/* Define custom context menu */
	ZUI.customContextMenu = new ZUI.ContextMenu();

	/* Set cursor to default */
	ZUI.container.style.cursor = "default";

	/* Set width and height */
	if (settings.width && settings.height) {
		ZUI.width = settings.width;
		ZUI.height = settings.height;
		ZUI.canvas.width = ZUI.width;
		ZUI.canvas.height = ZUI.height;
	}
	else {
		ZUI.width = ZUI.canvas.width;
		ZUI.height = ZUI.canvas.height;
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
	ZUI.canvas.addEventListener("gesturestart", ZUI.gestureStart, false);
	ZUI.canvas.addEventListener("gesturechange", ZUI.gestureChange, false);
	ZUI.canvas.addEventListener("gestureend", ZUI.gestureEnd, false);

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
		}
		for (n = 0; n < viewObjects.length; n++) {
			if (viewObjects[n] != viewObject && viewObjects[n].isHovered) {
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
	}

	ZUI.activeView.mouseMove();
	for (n = 0; n < viewObjects.length; n++) {
		if (viewObjects[n] != viewObject && viewObjects[n].isHovered) {
			viewObjects[n].isHovered = false;
			viewObjects[n].mouseOut();
		}
	}
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
		if (ZUI.customContextMenu.active) {
			ZUI.customContextMenu.close();
		}
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

/* Gesture (multitouch) start event callback */
ZUI.gestureStart = function(event) {
	/* Initialize gesture status */
	ZUI.touchStatus.lastPinch = 1;
	ZUI.touchStatus.lastRotation = 0;
};

/* Gesture (multitouch) change event callback */
ZUI.gestureChange = function(event) {
	/* Update pinch */
	if (!ZUI.touchStatus.isPinch && event.scale != 1) {
		ZUI.touchStatus.isPinch = true;
		ZUI.activeView.pinch(event.scale / ZUI.touchStatus.lastPinch);
		ZUI.touchStatus.lastPinch = event.scale;
	}
	else if (ZUI.touchStatus.lastPinch != event.scale) {
		ZUI.activeView.pinch(event.scale / ZUI.touchStatus.lastPinch);
		ZUI.touchStatus.lastPinch = event.scale;
	}

	/* Update rotate */
	if (!ZUI.touchStatus.isRotate && event.rotation != 0) {
		ZUI.touchStatus.isRotate = true;
		ZUI.activeView.rotate(event.rotation - ZUI.touchStatus.lastRotate);
		ZUI.touchStatus.lastRotate = event.rotation;
	}
	else if (ZUI.touchStatus.lastRotate != event.rotation) {
		ZUI.activeView.rotate(event.rotation - ZUI.touchStatus.lastRotate);
		ZUI.touchStatus.lastRotate = event.rotation;
	}
};

/* Gesture (multitouch) end event callback */
ZUI.gestureEnd = function(event) {
	/* Reset gesture status */
	ZUI.touchStatus.isPinch = false;
	ZUI.touchStatus.isRotate = false;
};

/* Disables pointer events for the ZUI canvas */
/* This is useful when pointer events should be passed to a layer under the ZUI canvas and interactivity in the ZUI canvas is not required */
ZUI.disablePointerEvents = function() {
	ZUI.canvas.style.pointerEvents = "none";
};

/* Restores pointer events for the ZUI canvas */
ZUI.restorePointerEvents = function() {
	ZUI.canvas.style.pointerEvents = "auto";
};

/* Gets mouse screen coordinates */
ZUI.getMousePosition = function(event) {
	var canvasBoundingRect = ZUI.canvas.getBoundingClientRect();
	return {
		x: event.clientX - canvasBoundingRect.left,
		y: event.clientY - canvasBoundingRect.top
	};
};

/* Fires a ZUI event */
ZUI.fireEvent = function(event) {
	/* Filter event listeners by type */
	var eventListeners1 = ZUI.eventListeners.get(event.type);
	if (!eventListeners1) {
		return;
	}

	/* Filter event listeners by target */
	var eventListeners2 = eventListeners1.get(event.target);
	if (eventListeners2) {
		/* Execute callback functions */
		for (var n = 0; n < eventListeners2.length; n++) {
			eventListeners2[n].callback(event, event.data, eventListeners2[n].data);
		}
	}

	/* Execute callback functions with no particular target */
	var eventListeners3 = eventListeners1.get("_all");
	if (eventListeners3) {
		for (n = 0; n < eventListeners3.length; n++) {
			eventListeners3[n].callback(event, event.data, eventListeners3[n].data);
		}
	}
};

/* Adds a ZUI event listener */
ZUI.addEventListener = function(eventListener) {
	/* Filter event listeners by type */
	var eventListeners1 = ZUI.eventListeners.get(eventListener.type);
	if (!eventListeners1) {
		eventListeners1 = new ZUI.HashMap();
		ZUI.eventListeners.put(eventListener.type, eventListeners1);
	}

	/* Filter event listeners by target */
	var target = eventListener.target;
	if (target === undefined || target === null) {
		target = "_all";
	}
	var eventListeners2 = eventListeners1.get(target);
	if (!eventListeners2) {
		eventListeners2 = [];
		eventListeners1.put(target, eventListeners2);
	}

	/* Add event listener */
	eventListeners2.push(eventListener);
};

/* Removes a ZUI event listener */
ZUI.removeEventListener = function(eventListener) {
	/* Filter event listeners by type */
	var eventListeners1 = ZUI.eventListeners.get(eventListener.type);
	if (!eventListeners1) {
		return;
	}

	/* Filter event listeners by target */
	var target = eventListener.target;
	if (target === undefined || target === null) {
		target = "_all";
	}
	var eventListeners2 = eventListeners1.get(target);
	if (!eventListeners2) {
		return;
	}

	/* Remove event listener */
	var index = eventListeners2.indexOf(eventListener);
	if (index < 0) {
		return;
	}
	eventListeners2.splice(index, 1);

	/* Remove target level eventListeners if empty */
	if (eventListeners2.length == 0) {
		eventListeners1.delete(target);
	}

	/* Remove type level eventListeners if empty */
	if (eventListeners1.length == 0) {
		ZUI.eventListeners.delete(eventListener.type);
	}
};

/* Removes all ZUI event listeners for the specified target */
ZUI.removeEventListenersForTarget = function(target) {
	var keys = ZUI.eventListeners.getKeys();
	for (var n = 0; n < keys.length; n++) {
		var key = keys[n];
		var eventListeners = ZUI.eventListeners.get(key);
		if (eventListeners.get(target)) {
			eventListeners.delete(target);
		}
		if (!eventListeners.getSize()) {
			ZUI.eventListeners.delete(key);
		}
	}
};

/* Function for passing input events to another element, override with custom function if needed */
ZUI.passInputEvent = null;
