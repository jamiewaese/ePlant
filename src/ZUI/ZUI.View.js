/**
 * View class for ZUI framework
 * By Hans Yu
 */

/* Class constructor */
ZUI.View = function() {
	this.viewObjects = [];
	this.animations = [];
};

/* Start an animation */
ZUI.View.prototype.animate = function(animation) {
	this.animations.push(animation);
	animation.begin();
};

/* Called when View becomes active */
ZUI.View.prototype.active = function() {};

/* Called when View becomes inactive */
ZUI.View.prototype.inactive = function() {};

/* Called when View is ready to be drawn */
ZUI.View.prototype.draw = function() {};

/* Manually call when View is no longer needed */
ZUI.View.prototype.remove = function() {};

/* Called when left mouse is down */
ZUI.View.prototype.leftMouseDown = function() {};

/* Called when middle mouse is down */
ZUI.View.prototype.middleMouseDown = function() {};

/* Called when right mouse is down */
ZUI.View.prototype.rightMouseDown = function() {};

/* Called when left mouse is up */
ZUI.View.prototype.leftMouseUp = function() {};

/* Called when middle mosuse is up */
ZUI.View.prototype.middleMouseUp = function() {};

/* Called when right mouse is up */
ZUI.View.prototype.rightMouseUp = function() {};

/* Called when mouse moves */
ZUI.View.prototype.mouseMove = function() {};

/* Called when left mouse is clicked */
ZUI.View.prototype.leftClick = function() {};

/* Called when middle mouse is clicked */
ZUI.View.prototype.middleClick = function() {};

/* Called when right mouse is clicked */
ZUI.View.prototype.rightClick = function() {};

/* Called when left mouse is double clicked */
ZUI.View.prototype.leftDoubleClick = function() {};

/* Called when middle mouse is double clicked */
ZUI.View.prototype.middleDoubleClick = function() {};

/* Called when mouse wheel is scrolled */
ZUI.View.prototype.mouseWheel = function(scroll) {};

/* Called when context menu is summoned */
ZUI.View.prototype.contextMenu = function() {};

ZUI.View.prototype.pinch = function(scale) {};

ZUI.View.prototype.rotate = function(rotation) {};

ZUI.View.prototype.touchStart = function(pointer) {};

ZUI.View.prototype.touchMove = function(pointer) {};

ZUI.View.prototype.touchEnd = function(pointer) {};

ZUI.View.prototype.touchCancel = function(pointer) {};

