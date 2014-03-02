/**
 * Experiment View class
 * UI design by Jamie Waese
 * Code by Hans Yu
 */

function ExperimentView(elementOfInterest) {
	/* Call parent constructor */
	ZUI.View.call(this);

	/* Properties */
	this.elementOfInterest = elementOfInterest;
	this.isDataReady = false;
	this.selectedItem = null;
	this.itemList = new ExperimentView.ItemList(this);
}

/* Inherit from View superclass */
ZUI.Util.inheritClass(ZUI.View, ExperimentView);

/* Override active callback method */
ExperimentView.prototype.active = function() {
	/* Append to view history */
	if (Eplant.viewHistory[Eplant.viewHistorySelected] != this) {
		Eplant.pushViewHistory(this);
	}

	/* Select first item on the list */
	this.itemList.items[0].container.onmouseover();

	/* Append list to container */
	ZUI.container.appendChild(this.itemList.container);
};

/* Override inactive callback method */
ExperimentView.prototype.inactive = function() {
	/* Remove list from container */
	ZUI.container.removeChild(this.itemList.container);
};

ExperimentView.prototype.draw = function() {
	/* Update camera */
	ZUI.camera.update();

	/* Draw selected item */
	if (this.selectedItem != null) {
		this.selectedItem.snapshot.draw();
	}
};

ExperimentView.prototype.getLoadProgress = function() {
	if (this.isDataReady) return 1;
	else return 0;
};

/* Returns animation settings for zoom out entry animation */
ExperimentView.prototype.getZoomOutEntryAnimationSettings = function() {
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.25, 0.1, 0.25, 1],
		sourceX: ZUI.width / 6,
		sourceY: 0,
		sourceDistance: 0,
		targetX: 0,
		targetY: 0,
		targetDistance: 500,
		draw: function(elapsedTime, remainingTime, view) {
			view.draw();
		}
	};
};

/* Returns animation settings for zoom in exit animation */
ExperimentView.prototype.getZoomInExitAnimationSettings = function() {
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.25, 0.1, 0.25, 1],
		targetX: ZUI.width / 6,
		targetY: 0,
		targetDistance: 0,
		draw: function(elapsedTime, remainingTime, view) {
			view.draw();
		}
	};
};

/* Returns animation settings for zoom in entry animation */
ExperimentView.prototype.getZoomInEntryAnimationSettings = function() {
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.75, 0, 0.75, 0.9],
		sourceX: -ZUI.width / 6 / 500 * (10000 - 500),
		sourceY: 0,
		sourceDistance: 10000,
		targetX: 0,
		targetY: 0,
		targetDistance: 500,
		draw: function(elapsedTime, remainingTime, view) {
			view.draw();
		}
	};
};

/* Returns animation settings for zoom out exit animation */
ExperimentView.prototype.getZoomOutExitAnimationSettings = function() {
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.25, 0.1, 0.25, 1],
		targetX: -ZUI.width / 6 / 500 * (10000 - 500),
		targetY: 0,
		targetDistance: 10000,
		draw: function(elapsedTime, remainingTime, view) {
			view.draw();
		}
	};
};

/* Returns the animation settings for pan left entry animation */
ExperimentView.prototype.getPanRightEntryAnimationSettings = function() {
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.75, 0, 0.75, 0.9],
		sourceX: -900,
		sourceY: 0,
		sourceDistance: 500,
		targetX: 0,
		draw: function(elapsedTime, remainingTime, view) {
			view.draw();
		}
	};
};

/* Returns the animation settings for pan right exit animation */
ExperimentView.prototype.getPanLeftExitAnimationSettings = function() {
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.75, 0, 0.75, 0.9],
		targetX: ZUI.camera._x - 900,
		draw: function(elapsedTime, remainingTime, view) {
			view.draw();
		}
	};
};
