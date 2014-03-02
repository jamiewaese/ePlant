/**
 * Plant View class
 * UI design by Jamie Waese
 * Code by Hans Yu
 */

function PlantView(elementOfInterest) {
	EFPView.call(this, elementOfInterest, "data/plant/" + elementOfInterest.element.chromosome.species.scientificName.replace(" ", "_") + ".json");
}

/* Inherit from EFPView superclass, http://stackoverflow.com/questions/7533473/javascript-inheritance-when-constructor-has-arguments */

ZUI.Util.inheritClass(EFPView, PlantView);

PlantView.prototype.active = function() {
	ZUI.container.style.cursor = "default";

	EFPView.prototype.active.call(this);

	/* Append view-specific UI */
	var viewSpecificUI = document.getElementById("viewSpecificUI");
	viewSpecificUI.appendChild(this.modeContainerElement);
	viewSpecificUI.appendChild(this.compareContainerElement);
	viewSpecificUI.appendChild(this.maskContainerElement);
	viewSpecificUI.appendChild(this.legendContainerElement);
};

PlantView.prototype.inactive = function() {
	EFPView.prototype.inactive.call(this);
};

PlantView.prototype.mouseMove = function() {
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
PlantView.prototype.mouseWheel = function(scroll) {
	/* Get mouse status */
	var x = ZUI.mouseStatus.x;
	var y = ZUI.mouseStatus.y;

	/* Zoom at mouse position */
	var point = ZUI.camera.unprojectPoint(x, y);
	ZUI.camera.x += (point.x - ZUI.camera.x) * scroll * 0.1;
	ZUI.camera.y += (point.y - ZUI.camera.y) * scroll * 0.1;
	ZUI.camera.distance *= 1 - scroll * 0.1;
};

PlantView.prototype.getZoomInEntryAnimationSettings = function() {
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

PlantView.prototype.getZoomOutEntryAnimationSettings = function() {
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

PlantView.prototype.getZoomInExitAnimationSettings = function() {
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

PlantView.prototype.getZoomOutExitAnimationSettings = function() {
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
