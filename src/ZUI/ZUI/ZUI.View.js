/**
 * View class for ZUI framework
 * By Hans Yu
 */

/* Class constructor */
ZUI.View = function() {
	this.viewObjects = [];
};

/* Called when View becomes active */
ZUI.View.prototype.active = function() {};

/* Called when View becomes inactive */
ZUI.View.prototype.inactive = function() {};

/* Called when View is ready to be drawn */
ZUI.View.prototype.draw = function() {};

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

/* Returns the load progress of the View (0 to 1) */
ZUI.View.prototype.getLoadProgress = function() {};

