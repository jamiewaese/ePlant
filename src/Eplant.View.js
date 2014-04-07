(function() {

/**
 * Eplant.View class
 * By Hans Yu
 * 
 * Base class for all ePlant views.
 *
 * @constructor
 * @augments ZUI.View
 * @param {String} name Name of the View visible to the user.
 * @param {String} hierarchy Description of the level of hierarchy.
 * 	Can be "ePlant", "species", or "genetic element".
 * @param {Number} magnification Arbitrary magnification value of the View.
 * 	This is evaluated relative to the magnification value of other Views.
 * 	Whole number value is used to determine the magnification level of the View.
 * 	Decimal number value is used to determine the position of the View relative 
 * 	to another with the same Magnification level.
 * @param {String} description Description of the View visible to the user.
 * @param {String} citation Citation template of the View.
 * @param {String} activeIconImageURL URL of the active icon image.
 * @param {String} availableIconImageURL URL of the available icon image.
 * @param {String} unavailableIconImageURL URL of the unavailable icon image.
 */
Eplant.View = function(name, hierarchy, magnification, description, citation, activeIconImageURL, availableIconImageURL, unavailableIconImageURL) {
	/* Call parent constructor */
	ZUI.View.call(this);

	/* Store properties */
	this.name = name;				// Name of the View visible to the user
	this.hierarchy = hierarchy;			// Description of the level of hierarchy
	this.magnification = magnification;	// Arbitrary magnification value of the View
	this.description = description;		// Description of the View visible to the user
	this.citation = citation;			// Citation template of the View
	this.activeIconImageURL = activeIconImageURL;			// Image URL of the active icon
	this.availableIconImageURL = availableIconImageURL;		// Image URL of the available icon
	this.unavailableIconImageURL = unavailableIconImageURL;		// Image URL of the unavailable icon
	this.isLoadedData = false;			// Whether data is loaded
	this.viewSpecificUIButtons = [];		// Array of ViewSpecificUIButtons
	this.species = null;				// Associated Species, must define if appropriate
	this.geneticElement = null;			// Associated GeneticElement, must define if appropriate
};
ZUI.Helper.inheritClass(ZUI.View, Eplant.View);	// Inherit parent prototype

/**
 * Default active callback method.
 *
 * @override
 */
Eplant.View.prototype.active = function() {
	/* Append View to History */
	if (!Eplant.history.activeItem || Eplant.history.activeItem.view != this) {
		var historyItem = new Eplant.History.Item(this);
		Eplant.history.addItem(historyItem);
	}

	/* Restore cursor */
	ZUI.container.style.cursor = "default";

	/* Restore camera */
	ZUI.camera.setPosition(0, 0);
	ZUI.camera.setDistance(500);

	/* Attach ViewSpecificUIButtons */
	for (var n = 0; n < this.viewSpecificUIButtons.length; n++) {
		var viewSpecificUIButton = this.viewSpecificUIButtons[n];
		viewSpecificUIButton.attach();
	}
};

/**
 * Default inactive callback method.
 *
 * @override
 */
Eplant.View.prototype.inactive = function() {
	/* Detach ViewSpecificUIButtons */
	for (var n = 0; n < this.viewSpecificUIButtons.length; n++) {
		var viewSpecificUIButton = this.viewSpecificUIButtons[n];
		viewSpecificUIButton.detach();
	}
};

/**
 * Default method for drawing the View's frame.
 *
 * @override
 */
Eplant.View.prototype.draw = function() {
	/* Update camera */
	ZUI.camera.update();
};

/**
 * Default method for removing the View.
 *
 * @override
 */
Eplant.View.prototype.remove = function() {
	/* Clear ViewObjects array */
	this.viewObjects = [];

	/* Remove ViewSpecificUIButtons */
	for (var n = 0; n < this.viewSpecificUIButtons.length; n++) {
		var viewSpecificUIButton = this.viewSpecificUIButtons[n];
		viewSpecificUIButton.remove();
	}
};

/**
 * Saves the current session.
 * Should be overrided if needed.
 */
Eplant.View.prototype.saveSession = function() {
};

/**
 * Loads saved session.
 * Should be overrided if needed.
 */
Eplant.View.prototype.loadSession = function(sessionData) {
};

/**
 * This method should be called when the View finishes loading.
 * If no loading is required, call this method in the constructor.
 */
Eplant.View.prototype.loadFinish = function() {
	/* Set load status */
	this.isLoadedData = true;

	/* Fire event to signal loading is finished */
	var event = new ZUI.Event("view-loaded", this, null);
	ZUI.fireEvent(event);
};

/**
 * Default method for grabbing the View's screen.
 *
 * @return {DOMString}
 */
Eplant.View.prototype.getViewScreen = function() {
	return ZUI.canvas.toDataURL();
};

/**
 * Returns the default exit-out animation configuration.
 *
 * @return {Object} The default exit-out animation configuration.
 */
Eplant.View.prototype.getExitOutAnimationConfig = function() {
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.75, 0, 0.75, 0.9],
		targetX: 0,
		targetY: 0,
		targetDistance: 10000,
		draw: function(elapsedTime, remainingTime, view, data) {
			view.draw();
		}
	};
};

/**
 * Returns the default enter-out animation configuration.
 *
 * @return {Object} The default enter-out animation configuration.
 */
Eplant.View.prototype.getEnterOutAnimationConfig = function() {
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.25, 0.1, 0.25, 1],
		sourceX: 0,
		sourceY: 0,
		sourceDistance: 0,
		targetX: 0,
		targetY: 0,
		targetDistance: 500,
		draw: function(elapsedTime, remainingTime, view, data) {
			view.draw();
		}
	};
};

/**
 * Returns the default exit-in animation configuration.
 *
 * @return {Object} The default exit-in animation configuration.
 */
Eplant.View.prototype.getExitInAnimationConfig = function() {
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.75, 0, 0.75, 0.9],
		targetX: 0,
		targetY: 0,
		targetDistance: 0,
		draw: function(elapsedTime, remainingTime, view, data) {
			view.draw();
		}
	};
};

/**
 * Returns the default enter-in animation configuration.
 *
 * @return {Object} The default enter-in animation configuration.
 */
Eplant.View.prototype.getEnterInAnimationConfig = function() {
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.25, 0.1, 0.25, 1],
		sourceX: 0,
		sourceY: 0,
		sourceDistance: 10000,
		targetX: 0,
		targetY: 0,
		targetDistance: 500,
		draw: function(elapsedTime, remainingTime, view, data) {
			view.draw();
		}
	};
};

/**
 * Returns the default exit-right animation configuration.
 *
 * @return {Object} The default exit-right animation configuration.
 */
Eplant.View.prototype.getExitRightAnimationConfig = function() {
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.75, 0, 0.75, 0.9],
		targetX: ZUI.camera._x + 900,
		draw: function(elapsedTime, remainingTime, view, data) {
			view.draw();
		}
	};
};

/**
 * Returns the default enter-right animation configuration.
 *
 * @return {Object} The default enter-right animation configuration.
 */
Eplant.View.prototype.getEnterRightAnimationConfig = function() {
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.75, 0, 0.75, 0.9],
		sourceX: -900,
		sourceY: 0,
		sourceDistance: 500,
		targetX: 0,
		draw: function(elapsedTime, remainingTime, view, data) {
			view.draw();
		}
	};
};

/**
 * Returns the default exit-left animation configuration.
 *
 * @return {Object} The default exit-left animation configuration.
 */
Eplant.View.prototype.getExitLeftAnimationConfig = function() {
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.75, 0, 0.75, 0.9],
		targetX: ZUI.camera._x - 900,
		draw: function(elapsedTime, remainingTime, view, data) {
			view.draw();
		}
	};
};

/**
 * Returns the default enter-left animation configuration.
 *
 * @return {Object} The default enter-left animation configuration.
 */
Eplant.View.prototype.getEnterLeftAnimationConfig = function() {
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.75, 0, 0.75, 0.9],
		sourceX: 900,
		sourceY: 0,
		sourceDistance: 500,
		targetX: 0,
		draw: function(elapsedTime, remainingTime, view, data) {
			view.draw();
		}
	};
};

})();
