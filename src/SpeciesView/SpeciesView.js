/**
 * SpeciesView class
 * UI design by Jamie Waese
 * Code by Hans Yu
 *
 * This is a View class for letting the user choose which species to work with.
 */

/* Constructor */
function SpeciesView() {
	/* Call superclass constructor */
	ZUI.View.call(this);

	/* Properties */
	this.isDataReady = false;			// Data loading status
	this.selectedSpecies = null;		// Species selected
	this.speciesList = new SpeciesView.SpeciesList(this);	// Species list
}

/* Inherit from View superclass */
SpeciesView.prototype = new ZUI.View();
SpeciesView.prototype.constructor = SpeciesView;

/* active event handler */
SpeciesView.prototype.active = function() {
	/* Append to view history */
	if (Eplant.viewHistory[Eplant.viewHistorySelected] != this) {
		Eplant.pushViewHistory(this);
	}

	/* Hide extra UI */
	$(".hiddenInSpeciesView").css("opacity", "0");
	setTimeout(function() {
		$(".hiddenInSpeciesView").css("visibility", "hidden");
	}, 1000)

	/* Add species list element */
	ZUI.container.appendChild(this.speciesList.element);

	/* Show focused species of interest */
	if (Eplant.speciesOfFocus != null) {
		for (var n = 0; n < this.speciesList.items.length; n++) {
			if (this.speciesList.items[n].species == Eplant.speciesOfFocus.species) {
				this.speciesList.items[n].element.onmouseover();
				break;
			}
		}
	}
	else {
		this.selectedSpecies = null;
	}
};

/* inactive event handler */
SpeciesView.prototype.inactive = function() {
	/* Show extra UI */
	$(".hiddenInSpeciesView").css("visibility", "visible");
	$(".hiddenInSpeciesView").css("opacity", "1");

	/* Remove species list */
	ZUI.container.removeChild(this.speciesList.element);
};

/* draw event handler */
SpeciesView.prototype.draw = function() {
	/* Update camera */
	ZUI.camera.update();

	/* Draw species */
	if (this.selectedSpecies != null) {
		this.selectedSpecies.viewObject.draw();
	}
};

/* Clean up */
SpeciesView.prototype.remove = function() {
	/* Remove species view objects */
	for (var n = 0; n < this.speciesList.items.length; n++) {
		var speciesItem = this.speciesList.items[n];
		speciesItem.viewObject.remove();
	}
};

/* Returns the view's load progress */
SpeciesView.prototype.getLoadProgress = function() {
	if (this.isDataReady) return 1;
	else return 0;
};

/* Returns animation settings for zoom out entry animation */
SpeciesView.prototype.getZoomOutEntryAnimationSettings = function() {
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
SpeciesView.prototype.getZoomInExitAnimationSettings = function() {
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
SpeciesView.prototype.getZoomInEntryAnimationSettings = function() {
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
