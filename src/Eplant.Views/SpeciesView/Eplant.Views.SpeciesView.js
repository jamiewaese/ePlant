(function() {

/**
 * Eplant.Views.SpeciesView class
 * Coded by Hans Yu
 * UI designed by Jamie Waese
 *
 * ePlant View for browsing and choosing Species.
 *
 * @constructor
 * @augments Eplant.View
 */
Eplant.Views.SpeciesView = function() {
	// Get constructor
	var constructor = Eplant.Views.SpeciesView;

	// Call parent constructor
	Eplant.View.call(this,
		constructor.viewName,			// Name of the View visible to the user
		constructor.hierarchy,			// Hierarchy of the View
		constructor.magnification,			// Magnification level of the View
		constructor.description,			// Description of the View visible to the user
		constructor.citation,			// Citation template of the View
		constructor.activeIconImageURL,		// URL for the active icon image
		constructor.availableIconImageURL,		// URL for the available icon image
		constructor.unavailableIconImageURL	// URL for the unavailable icon image
	);

	/* Attributes */
	this.isEntryView = true;		// Identifies this View as the entry View for ePlant
	this.selectList = null;		// SelectList that handles the selection UI
	this.isAnimating = false;		// Whether an animation is taking place

	/* Create SelectList */
	this.selectList = new Eplant.Views.SpeciesView.SelectList(this);
};
ZUI.Helper.inheritClass(Eplant.View, Eplant.Views.SpeciesView);		// Inherit parent prototype

Eplant.Views.SpeciesView.viewName = "Species Viewer";
Eplant.Views.SpeciesView.hierarchy = "ePlant";
Eplant.Views.SpeciesView.magnification = 20;
Eplant.Views.SpeciesView.description = "Species viewer";
Eplant.Views.SpeciesView.citation = "";
Eplant.Views.SpeciesView.activeIconImageURL = "img/active/species.png";
Eplant.Views.SpeciesView.availableIconImageURL = "img/available/species.png";
Eplant.Views.SpeciesView.unavailableIconImageURL = "img/unavailable/species.png";

/**
 * Active callback method.
 *
 * @override
 */
Eplant.Views.SpeciesView.prototype.active = function() {
	/* Call parent method */
	Eplant.View.prototype.active.call(this);

	/* Hide extra UI */
	$(".hiddenInSpeciesView").css("opacity", "0");
	setTimeout($.proxy(function() {
		if (ZUI.activeView == this) {
			$(".hiddenInSpeciesView").css("visibility", "hidden");
		}
	}, this), 1000)

	/* Update SelectList's selected Choice */
	if (this.selectList.selected) {
		this.selectList.selected.unselect();
	}
	var choice = this.selectList.getChoiceBySpecies(Eplant.activeSpecies);
	if (choice) {
		choice.select();
	}
	else if (this.selectList.choices.length) {
		this.selectList.choices[0].select();
	}

	/* Show SelectList */
	this.selectList.show();
};

/**
 * Inactive callback method.
 *
 * @override
 */
Eplant.Views.SpeciesView.prototype.inactive = function() {
	/* Call parent method */
	Eplant.View.prototype.inactive.call(this);

	/* Show extra UI */
	$(".hiddenInSpeciesView").css("visibility", "visible");
	$(".hiddenInSpeciesView").css("opacity", "1");

	/* Hide SelectList */
	this.selectList.hide();
};

/**
 * Draws the View's frame.
 *
 * @Override
 */
Eplant.Views.SpeciesView.prototype.draw = function() {
	/* Call parent method */
	Eplant.View.prototype.draw.call(this);

	/* Draw SelectList */
	this.selectList.draw();
};

/**
 * Cleans up the View for disposal
 *
 * @override
 */
Eplant.Views.SpeciesView.prototype.remove = function() {
	/* Call parent method */
	Eplant.View.prototype.remove.call(this);

	/* Clean up SelectList */
	this.selectList.remove();
};

/**
 * Returns the enter-out animation configuration.
 *
 * @override
 * @return {Object} The enter-out animation configuration.
 */
Eplant.Views.SpeciesView.prototype.getEnterOutAnimationConfig = function() {
	var config = Eplant.View.prototype.getEnterOutAnimationConfig.call(this);
	config.sourceX = ZUI.width / 6;
	config.data = {
		speciesView: this
	};
	config.begin = function(data) {
		data.speciesView.isAnimating = true;
	};
	config.end = function(data) {
		data.speciesView.isAnimating = false;
	};
	return config;
};

/**
 * Returns the exit-in animation configuration.
 *
 * @override
 * @return {Object} The exit-in animation configuration.
 */
Eplant.Views.SpeciesView.prototype.getExitInAnimationConfig = function() {
	var config = Eplant.View.prototype.getExitInAnimationConfig.call(this);
	config.targetX = ZUI.width / 6;
	config.data = {
		speciesView: this
	};
	config.begin = function(data) {
		data.speciesView.isAnimating = true;
	};
	config.end = function(data) {
		data.speciesView.isAnimating = false;
	};
	return config;
};

/**
 * Returns the enter-in animation configuration.
 *
 * @override
 * @return {Object} The enter-in animation configuration.
 */
Eplant.Views.SpeciesView.prototype.getEnterInAnimationConfig = function() {
	var config = Eplant.View.prototype.getEnterInAnimationConfig.call(this);
	config.sourceX = -ZUI.width / 6 / 500 * (10000 - 500);
	config.data = {
		speciesView: this
	};
	config.begin = function(data) {
		data.speciesView.isAnimating = true;
	};
	config.end = function(data) {
		data.speciesView.isAnimating = false;
	};
	return config;
};

})();
