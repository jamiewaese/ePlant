/**
 * Cell View class
 * UI design by Jamie Waese
 * Code by Hans Yu
 */

function CellView(elementOfInterest) {
	EFPView.call(this, elementOfInterest, "data/cell/" + elementOfInterest.element.chromosome.species.scientificName.replace(" ", "_") + ".json");
}

/* Inherit from EFPView superclass */
ZUI.Util.inheritClass(EFPView, CellView);

CellView.prototype.active = function() {
	ZUI.container.style.cursor = "default";

	EFPView.prototype.active.call(this);

	/* Append view-specific UI */
	var viewSpecificUI = document.getElementById("viewSpecificUI");
	viewSpecificUI.appendChild(this.legendContainerElement);
};

CellView.prototype.inactive = function() {
	EFPView.prototype.inactive.call(this);
};

CellView.prototype.mouseMove = function() {
	/* Get mouse status */
	var x = ZUI.mouseStatus.x;
	var y = ZUI.mouseStatus.y;
	var xLast = ZUI.mouseStatus.xLast;
	var yLast = ZUI.mouseStatus.yLast;
	var leftDown = ZUI.mouseStatus.leftDown;

	/* Left drag behaviour */
	if (leftDown) {
		/* Move camera */
		ZUI.camera.x -= ZUI.camera.unprojectDistance(x - xLast);
		ZUI.camera.y -= ZUI.camera.unprojectDistance(y - yLast);
	}
};

/* Override mouseWheel */
CellView.prototype.mouseWheel = function(scroll) {
	/* Get mouse status */
	var x = ZUI.mouseStatus.x;
	var y = ZUI.mouseStatus.y;

	/* Zoom at mouse position */
	var point = ZUI.camera.unprojectPoint(x, y);
	ZUI.camera.x += (point.x - ZUI.camera.x) * scroll * 0.1;
	ZUI.camera.y += (point.y - ZUI.camera.y) * scroll * 0.1;
	ZUI.camera.distance *= 1 - scroll * 0.1;
};

CellView.prototype.getZoomInEntryAnimationSettings = function() {
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
		draw: function(elapsedTime, remainingTime, view) {
			view.draw();
		}
	};
};

CellView.prototype.getZoomOutEntryAnimationSettings = function() {
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.75, 0, 0.55, 0.9],
		sourceX: 0,
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

CellView.prototype.getZoomInExitAnimationSettings = function() {
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.25, 0.1, 0.25, 1],
		targetX: 0,
		targetY: 0,
		targetDistance: 0,
		draw: function(elapsedTime, remainingTime, view) {
			view.draw();
		}
	};
};

CellView.prototype.getZoomOutExitAnimationSettings = function() {
	return {
		type: "zoom",
		view: this,
		duration: 1000,
		bezier: [0.75, 0, 0.75, 0.9],
		targetX: 0,
		targetY: 0,
		targetDistance: 10000,
		draw: function(elapsedTime, remainingTime, view) {
			view.draw();
		}
	};
};
